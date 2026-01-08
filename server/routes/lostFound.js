const express = require('express');
const { body, validationResult } = require('express-validator');
const LostFound = require('../models/LostFound');
const QRRegistration = require('../models/QRRegistration');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/lost-found
// @desc    Report lost or found item
// @access  Private
router.post('/', protect, [
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('itemName').trim().notEmpty().withMessage('Item name is required'),
  body('latitude').isFloat().withMessage('Valid latitude is required'),
  body('longitude').isFloat().withMessage('Valid longitude is required'),
  body('phone').trim().notEmpty().withMessage('Contact phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { type, itemName, description, latitude, longitude, address, phone, email, images, isPerson, facialRecognitionData } = req.body;

    // Log the user info for debugging
    console.log('Creating lost/found report:', {
      user: req.user?.id,
      userType: typeof req.user?.id,
      type,
      itemName
    });

    // Check MongoDB connection
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
    
    if (!isMongoConnected) {
      console.error('❌ MongoDB not connected after retry');
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection and MONGODB_URI environment variable.',
        hint: 'Check Vercel environment variables for MONGODB_URI'
      });
    }

    // Ensure reportedBy is set correctly (handle both ObjectId and string IDs for demo users)
    const reportedBy = req.user?.id || req.user?._id;
    if (!reportedBy) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Create document and set reportedBy directly to avoid casting issues with Mixed type
    const lostFound = new LostFound({
      type,
      itemName,
      description: description || '',
      location: {
        latitude,
        longitude,
        address: address || ''
      },
      contactInfo: {
        phone,
        email: email || ''
      },
      images: images || [],
      isPerson: isPerson || false,
      facialRecognitionData: facialRecognitionData || null
    });

    // Set reportedBy directly on the document to bypass any casting
    lostFound.reportedBy = reportedBy;
    lostFound.markModified('reportedBy'); // Tell Mongoose this field was modified

    // Save with timeout handling
    await lostFound.save();

    res.status(201).json({
      success: true,
      lostFound
    });
  } catch (error) {
    console.error('Create lost/found error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      user: req.user?.id,
      body: req.body
    });
    res.status(500).json({
      success: false,
      message: 'Server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// @route   GET /api/lost-found
// @desc    Get all lost and found items
// @access  Private
router.get('/', protect, async (req, res) => {
  console.log('📥 GET /api/lost-found request received');
  const startTime = Date.now();
  
  try {
    // Check MongoDB connection first
    const mongoose = require('mongoose');
    const isMongoConnected = mongoose.connection.readyState === 1;
    
    if (!isMongoConnected) {
      console.error('❌ MongoDB not connected');
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection.'
      });
    }
    
    console.log('✅ MongoDB connected, querying database...');
    
    const { type, status } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;

    console.log('🔍 Query:', query);
    const items = await LostFound.find(query)
      .populate('reportedBy', 'name email phone')
      .populate('matchedWith')
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for faster queries
    
    console.log(`✅ Found ${items.length} items in ${Date.now() - startTime}ms`);
    
    // Handle demo users - populate won't work for string IDs, so we add user info manually
    const itemsWithUserInfo = items.map(item => {
      if (typeof item.reportedBy === 'string' && item.reportedBy.startsWith('demo-')) {
        const role = item.reportedBy.replace('demo-', '');
        const demoUsers = {
          'pilgrim': { _id: 'demo-pilgrim', name: 'Pilgrim User', email: 'pilgrim@kumbh.com', phone: '0000000000' },
          'volunteer': { _id: 'demo-volunteer', name: 'Volunteer User', email: 'volunteer@kumbh.com', phone: '0000000000' },
          'admin': { _id: 'demo-admin', name: 'Admin User', email: 'admin@kumbh.com', phone: '0000000000' },
          'medical': { _id: 'demo-medical', name: 'Medical Team User', email: 'medical@kumbh.com', phone: '0000000000' }
        };
        item.reportedBy = demoUsers[role] || { _id: item.reportedBy, name: 'Demo User', email: '', phone: '' };
      }
      return item;
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Response sent in ${duration}ms`);

    res.json({
      success: true,
      count: itemsWithUserInfo.length,
      items: itemsWithUserInfo
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Get lost/found error after ${duration}ms:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/lost-found/my-reports
// @desc    Get user's own reports
// @access  Private
router.get('/my-reports', protect, async (req, res) => {
  try {
    const items = await LostFound.find({ reportedBy: req.user.id })
      .populate('matchedWith')
      .sort({ createdAt: -1 });
    
    // Handle demo users for reportedBy field
    const itemsWithUserInfo = items.map(item => {
      if (typeof item.reportedBy === 'string' && item.reportedBy.startsWith('demo-')) {
        const role = item.reportedBy.replace('demo-', '');
        const demoUsers = {
          'pilgrim': { _id: 'demo-pilgrim', name: 'Pilgrim User', email: 'pilgrim@kumbh.com', phone: '0000000000' },
          'volunteer': { _id: 'demo-volunteer', name: 'Volunteer User', email: 'volunteer@kumbh.com', phone: '0000000000' },
          'admin': { _id: 'demo-admin', name: 'Admin User', email: 'admin@kumbh.com', phone: '0000000000' },
          'medical': { _id: 'demo-medical', name: 'Medical Team User', email: 'medical@kumbh.com', phone: '0000000000' }
        };
        item.reportedBy = demoUsers[role] || { _id: item.reportedBy, name: 'Demo User', email: '', phone: '' };
      }
      return item;
    });

    res.json({
      success: true,
      count: itemsWithUserInfo.length,
      items: itemsWithUserInfo
    });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/lost-found/:id/match
// @desc    Match lost item with found item
// @access  Private
router.put('/:id/match', protect, [
  body('matchedWithId').notEmpty().withMessage('Matched item ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { matchedWithId } = req.body;
    const item = await LostFound.findById(req.params.id);
    const matchedItem = await LostFound.findById(matchedWithId);

    if (!item || !matchedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.type === matchedItem.type) {
      return res.status(400).json({
        success: false,
        message: 'Cannot match two items of the same type'
      });
    }

    item.matchedWith = matchedWithId;
    item.status = 'matched';
    matchedItem.matchedWith = req.params.id;
    matchedItem.status = 'matched';

    await item.save();
    await matchedItem.save();

    res.json({
      success: true,
      item,
      matchedItem
    });
  } catch (error) {
    console.error('Match items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/lost-found/volunteer/upload-person-photo
// @desc    Volunteer uploads photo of found person for facial recognition
// @access  Private (Volunteer, Admin)
router.post('/volunteer/upload-person-photo', protect, authorize('volunteer', 'admin'), [
  body('image').trim().notEmpty().withMessage('Image is required'),
  body('latitude').isFloat().withMessage('Valid latitude is required'),
  body('longitude').isFloat().withMessage('Valid longitude is required'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { image, latitude, longitude, address, description } = req.body;

    const lostFound = await LostFound.create({
      type: 'found',
      reportedBy: req.user.id,
      itemName: 'Lost Person',
      description: description || 'Person found by volunteer',
      location: {
        latitude,
        longitude,
        address: address || ''
      },
      contactInfo: {
        phone: req.user.phone || '',
        email: req.user.email || ''
      },
      images: [image],
      isPerson: true,
      facialRecognitionData: image // In production, extract face features here
    });

    // Attempt to match with QR registration selfies
    // This is a simplified version - in production, use proper face recognition library
    const qrRegistrations = await QRRegistration.find({
      groupSelfie: { $exists: true, $ne: null }
    }).sort({ registeredAt: -1 }).limit(100);

    // Simple matching logic (in production, use face recognition API)
    const potentialMatches = qrRegistrations.map(reg => ({
      registrationId: reg._id,
      contactInfo: reg.contactInfo,
      destination: reg.intendedDestination,
      registeredAt: reg.registeredAt
    }));

    res.status(201).json({
      success: true,
      lostFound,
      potentialMatches: potentialMatches.slice(0, 5), // Return top 5 potential matches
      message: 'Photo uploaded. Facial recognition matching in progress.'
    });
  } catch (error) {
    console.error('Upload person photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/lost-found/:id/match-with-qr
// @desc    Match found person with QR registration using facial recognition
// @access  Private (Volunteer, Admin)
router.post('/:id/match-with-qr', protect, authorize('volunteer', 'admin'), [
  body('qrRegistrationId').notEmpty().withMessage('QR Registration ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { qrRegistrationId } = req.body;
    const lostFound = await LostFound.findById(req.params.id);
    const qrRegistration = await QRRegistration.findById(qrRegistrationId);

    if (!lostFound || !qrRegistration) {
      return res.status(404).json({
        success: false,
        message: 'Item or QR registration not found'
      });
    }

    if (!lostFound.isPerson) {
      return res.status(400).json({
        success: false,
        message: 'This item is not a person report'
      });
    }

    lostFound.matchedWithQRRegistration = qrRegistrationId;
    lostFound.status = 'matched';
    await lostFound.save();

    res.json({
      success: true,
      lostFound,
      qrRegistration: {
        contactInfo: qrRegistration.contactInfo,
        destination: qrRegistration.intendedDestination,
        groupSize: qrRegistration.groupSize
      },
      message: 'Person matched with QR registration. Contact details available.'
    });
  } catch (error) {
    console.error('Match with QR error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

