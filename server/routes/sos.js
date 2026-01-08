const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const SOS = require('../models/SOS');
const { protect, authorize } = require('../middleware/auth');
// Rate limiting disabled - uncomment to enable
// const { sosLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// @route   POST /api/sos
// @desc    Create SOS alert
// @access  Public (auth removed for development)
router.post('/', /* sosLimiter, */ /* protect, */ [
  body('latitude').isFloat().withMessage('Valid latitude is required'),
  body('longitude').isFloat().withMessage('Valid longitude is required'),
  body('message').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical'])
], async (req, res) => {
  console.log('🚨 SOS POST request received:', {
    body: req.body,
    hasUser: !!req.user,
    userId: req.user?.id
  });
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if MongoDB is connected
    const dbState = mongoose.connection.readyState;
    console.log('📊 MongoDB connection state:', dbState, '(1=connected, 0=disconnected, 2=connecting, 3=disconnecting)');
    
    if (dbState !== 1) {
      console.error('❌ MongoDB not connected. State:', dbState);
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please check MongoDB connection.'
      });
    }

    const { latitude, longitude, address, message, priority } = req.body;

    // Prepare SOS data
    const sosData = {
      location: {
        latitude,
        longitude,
        address: address || ''
      },
      message: message || '',
      priority: priority || 'high'
    };

    // Only add userId if user is authenticated and userId is valid
    if (req.user?.id) {
      sosData.userId = req.user.id;
    }
    // If userId is null/undefined, don't include it (schema allows it to be optional)

    console.log('💾 Creating SOS with data:', sosData);
    const sos = await SOS.create(sosData);
    console.log('✅ SOS created successfully:', sos._id);

    // Emit SOS alert via Socket.IO
    const io = req.app.get('io');
    if (io) {
      console.log('📡 Emitting SOS alert via Socket.IO');
      io.emit('sos-alert', {
        id: sos._id,
        userId: sos.userId,
        location: sos.location,
        message: sos.message,
        priority: sos.priority,
        createdAt: sos.createdAt
      });
    }

    console.log('✅ SOS response sent successfully');
    res.status(201).json({
      success: true,
      sos
    });
  } catch (error) {
    console.error('❌ Create SOS error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Always return detailed error in development
    const errorResponse = {
      success: false,
      message: error.message || 'Server error',
    };
    
    // Add detailed error info in development
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.error = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines of stack
      };
    }
    
    res.status(500).json(errorResponse);
  }
});

// @route   GET /api/sos
// @desc    Get all SOS alerts
// @access  Private (Volunteers, Admin, Medical)
router.get('/', protect, authorize('volunteer', 'admin', 'medical'), async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const sosAlerts = await SOS.find(query)
      .populate('userId', 'name email phone role')
      .populate('assignedTo', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sosAlerts.length,
      sosAlerts
    });
  } catch (error) {
    console.error('Get SOS alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/sos/my-sos
// @desc    Get user's own SOS alerts
// @access  Private
router.get('/my-sos', protect, async (req, res) => {
  try {
    const sosAlerts = await SOS.find({ userId: req.user.id })
      .populate('assignedTo', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sosAlerts.length,
      sosAlerts
    });
  } catch (error) {
    console.error('Get my SOS error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/sos/:id/acknowledge
// @desc    Acknowledge SOS alert
// @access  Private (Volunteers, Admin, Medical)
router.put('/:id/acknowledge', protect, authorize('volunteer', 'admin', 'medical'), async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);
    
    if (!sos) {
      return res.status(404).json({
        success: false,
        message: 'SOS alert not found'
      });
    }

    sos.status = 'acknowledged';
    sos.assignedTo = req.user.id;
    await sos.save();

    res.json({
      success: true,
      sos
    });
  } catch (error) {
    console.error('Acknowledge SOS error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/sos/:id/resolve
// @desc    Resolve SOS alert
// @access  Private (Volunteers, Admin, Medical)
router.put('/:id/resolve', protect, authorize('volunteer', 'admin', 'medical'), async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);
    
    if (!sos) {
      return res.status(404).json({
        success: false,
        message: 'SOS alert not found'
      });
    }

    sos.status = 'resolved';
    sos.resolvedAt = new Date();
    await sos.save();

    res.json({
      success: true,
      sos
    });
  } catch (error) {
    console.error('Resolve SOS error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

