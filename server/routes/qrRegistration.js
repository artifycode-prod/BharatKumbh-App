const express = require('express');
const { body, validationResult } = require('express-validator');
const QRRegistration = require('../models/QRRegistration');
const { protect, authorize } = require('../middleware/auth');
// Rate limiting disabled - uncomment to enable
// const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Test endpoint to verify connectivity
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'QR Registration endpoint is accessible',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path
  });
});

// @route   POST /api/qr/register
// @desc    Register group via QR code scan
// @access  Public (QR codes at entry points don't require auth)
router.post('/register', /* apiLimiter, */ [
  body('qrCodeId').trim().notEmpty().withMessage('QR Code ID is required'),
  body('entryPoint').isIn(['railway_station', 'bus_stand', 'parking_area', 'other']).withMessage('Invalid entry point'),
  body('entryPointName').trim().notEmpty().withMessage('Entry point name is required'),
  body('groupSize').isInt({ min: 1, max: 50 }).withMessage('Group size must be between 1 and 50'),
  body('luggageCount').isInt({ min: 0, max: 20 }).withMessage('Luggage count must be between 0 and 20'),
  body('intendedDestination').isIn(['Tapovan', 'Panchvati', 'Trambak', 'Ramkund', 'Kalaram', 'Sita Gufa', 'Other']).withMessage('Invalid destination'),
  body('groupSelfie').trim().notEmpty().withMessage('Group selfie is required'),
  body('latitude').isFloat().withMessage('Valid latitude is required'),
  body('longitude').isFloat().withMessage('Valid longitude is required'),
  body('contactInfo.phone').trim().notEmpty().withMessage('Contact phone is required')
], async (req, res) => {
  console.log('📥 QR Registration request received:', {
    method: req.method,
    path: req.path,
    body: { ...req.body, groupSelfie: req.body.groupSelfie ? 'present' : 'missing' },
    timestamp: new Date().toISOString()
  });

  // Set timeout to prevent hanging
  req.setTimeout(5000); // 5 seconds

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      qrCodeId,
      entryPoint,
      entryPointName,
      groupSize,
      luggageCount,
      intendedDestination,
      customDestination,
      groupSelfie,
      latitude,
      longitude,
      address,
      contactInfo
    } = req.body;

    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    let isMongoConnected = mongoose.connection.readyState === 1;
    
    // If not connected, try to connect
    if (!isMongoConnected) {
      console.log('🔄 MongoDB not connected, attempting connection...');
      const connectDB = require('../config/database');
      try {
        await connectDB();
        isMongoConnected = mongoose.connection.readyState === 1;
        console.log('✅ MongoDB connection established:', isMongoConnected);
      } catch (err) {
        console.error('❌ MongoDB connection attempt failed:', err.message);
      }
    }
    
    console.log('📊 MongoDB status:', isMongoConnected ? 'connected' : 'disconnected');

    if (!isMongoConnected) {
      console.error('❌ MongoDB not connected - cannot save data');
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection and MONGODB_URI environment variable.',
        error: 'MongoDB connection required for data storage',
        hint: 'Check Vercel environment variables for MONGODB_URI'
      });
    }

    // Only try to save if MongoDB is connected
    try {
      const registration = await Promise.race([
        QRRegistration.create({
          qrCodeId,
          entryPoint,
          entryPointName,
          registeredBy: req.user?.id || null,
          groupSize,
          luggageCount,
          intendedDestination,
          customDestination: intendedDestination === 'Other' ? customDestination : undefined,
          groupSelfie,
          location: {
            latitude,
            longitude,
            address: address || ''
          },
          contactInfo: {
            phone: contactInfo.phone,
            name: contactInfo.name || ''
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database operation timeout')), 5000)
        )
      ]);

      console.log('✅ QR Registration created:', registration._id);

      // Emit real-time crowd data update
      const io = req.app.get('io');
      if (io) {
        io.emit('crowd-update', {
          destination: intendedDestination,
          groupSize,
          timestamp: registration.registeredAt
        });
      }

      return res.status(201).json({
        success: true,
        registration
      });
    } catch (dbError) {
      console.error('❌ Database error:', dbError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to save registration to database',
        error: process.env.NODE_ENV === 'development' ? dbError.message : 'Database error'
      });
    }
  } catch (error) {
    console.error('❌ QR Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/qr/analytics
// @desc    Get crowd analytics by destination
// @access  Private (Admin, Volunteer, Medical)
router.get('/analytics', protect, async (req, res) => {
  try {
    const { destination, startDate, endDate } = req.query;
    
    const query = {};
    if (destination) {
      query.intendedDestination = destination;
    }
    if (startDate || endDate) {
      query.registeredAt = {};
      if (startDate) query.registeredAt.$gte = new Date(startDate);
      if (endDate) query.registeredAt.$lte = new Date(endDate);
    }

    // Get total registrations by destination
    const analytics = await QRRegistration.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$intendedDestination',
          totalGroups: { $sum: 1 },
          totalPeople: { $sum: '$groupSize' },
          totalLuggage: { $sum: '$luggageCount' },
          lastRegistration: { $max: '$registeredAt' }
        }
      },
      { $sort: { totalPeople: -1 } }
    ]);

    // Get recent registrations count (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await QRRegistration.countDocuments({
      ...query,
      registeredAt: { $gte: oneHourAgo }
    });

    res.json({
      success: true,
      analytics,
      recentRegistrations: recentCount,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/qr/destinations/:destination/crowd-status
// @desc    Get crowd status for a specific destination
// @access  Public
router.get('/destinations/:destination/crowd-status', async (req, res) => {
  try {
    const { destination } = req.params;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentRegistrations = await QRRegistration.find({
      intendedDestination: destination,
      registeredAt: { $gte: oneHourAgo }
    });

    const totalPeople = recentRegistrations.reduce((sum, reg) => sum + reg.groupSize, 0);
    
    // Determine crowd level
    let crowdLevel = 'low';
    if (totalPeople > 1000) crowdLevel = 'high';
    else if (totalPeople > 500) crowdLevel = 'moderate';

    res.json({
      success: true,
      destination,
      crowdLevel,
      estimatedPeople: totalPeople,
      groupsInLastHour: recentRegistrations.length,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get crowd status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/qr/registrations
// @desc    Get all registrations (with pagination)
// @access  Public (No auth required)
router.get('/registrations', async (req, res) => {
  console.log('📥 GET /api/qr/registrations request received');
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    let isMongoConnected = mongoose.connection.readyState === 1;
    
    if (!isMongoConnected) {
      console.log('🔄 MongoDB not connected, attempting connection...');
      const connectDB = require('../config/database');
      try {
        await connectDB();
        isMongoConnected = mongoose.connection.readyState === 1;
      } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
      }
    }
    
    if (!isMongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection.',
        hint: 'Check MONGODB_URI environment variable in Vercel'
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log('🔍 Querying registrations:', { page, limit, skip });

    const registrations = await QRRegistration.find()
      .populate('registeredBy', 'name email phone')
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await QRRegistration.countDocuments();

    console.log('✅ Found registrations:', { count: registrations.length, total });

    res.json({
      success: true,
      registrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get registrations error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;


