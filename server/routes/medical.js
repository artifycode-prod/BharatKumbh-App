const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { protect, authorize } = require('../middleware/auth');

// Require model after mongoose is loaded to ensure fresh schema
let MedicalCase;
try {
  // Delete cached model if exists
  if (mongoose.models.MedicalCase) {
    delete mongoose.models.MedicalCase;
    delete mongoose.connection.models.MedicalCase;
    delete mongoose.modelSchemas.MedicalCase;
  }
  MedicalCase = require('../models/MedicalCase');
} catch (error) {
  console.error('Error loading MedicalCase model:', error);
  MedicalCase = require('../models/MedicalCase');
}

const router = express.Router();

// @route   POST /api/medical/cases
// @desc    Create medical case
// @access  Private
router.post('/cases', protect, [
  body('caseType').isIn(['emergency', 'consultation', 'medication', 'checkup']).withMessage('Invalid case type'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('latitude').isFloat().withMessage('Valid latitude is required'),
  body('longitude').isFloat().withMessage('Valid longitude is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check MongoDB connection
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

    const { 
      patientId, 
      patientName, 
      patientAge, 
      patientGender,
      caseType, 
      description, 
      medicalIssue,
      allergies,
      emergencyContact,
      symptoms, 
      severity, 
      latitude, 
      longitude, 
      address 
    } = req.body;

    // Log the user info for debugging
    console.log('Creating medical case:', {
      user: req.user?.id,
      userType: typeof req.user?.id,
      caseType,
      patientName: patientName || (req.user ? req.user.name : 'Unknown')
    });

    // Ensure reportedBy and patientId are set correctly (handle both ObjectId and string IDs for demo users)
    const reportedBy = req.user?.id || req.user?._id;
    const finalPatientId = patientId || reportedBy || null;

    if (!reportedBy) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Create document WITHOUT patientId and reportedBy in constructor
    // We'll set them after creation to avoid casting issues with Mixed type
    const medicalCase = new MedicalCase({
      patientName: patientName || (req.user ? req.user.name : 'Unknown'),
      patientAge: patientAge || null,
      patientGender: patientGender || '',
      caseType,
      description,
      medicalIssue: medicalIssue || description,
      allergies: allergies || '',
      emergencyContact: emergencyContact || '',
      symptoms: symptoms || [],
      severity: severity || 'medium',
      location: {
        latitude,
        longitude,
        address: address || ''
      }
      // DO NOT include patientId or reportedBy here - set them after creation
    });

    // Set Mixed type fields directly AFTER creation to bypass any casting
    // This is necessary because Mixed type fields need markModified() to work correctly
    medicalCase.patientId = finalPatientId;
    medicalCase.reportedBy = reportedBy;
    medicalCase.markModified('patientId'); // Tell Mongoose this field was modified
    medicalCase.markModified('reportedBy'); // Tell Mongoose this field was modified

    // Save with error handling
    try {
      await medicalCase.save();
    } catch (saveError) {
      // If save fails due to casting, try to save as raw document
      if (saveError.name === 'ValidationError' || saveError.message.includes('Cast to ObjectId')) {
        console.error('Save failed with casting error, trying alternative save method:', saveError.message);
        // Convert to plain object and use insertOne
        const plainDoc = medicalCase.toObject();
        delete plainDoc._id; // Remove _id to let MongoDB generate it
        const result = await MedicalCase.collection.insertOne(plainDoc);
        medicalCase._id = result.insertedId;
        // Reload the document
        medicalCase.isNew = false;
      } else {
        throw saveError; // Re-throw if it's a different error
      }
    }

    // Emit medical emergency notification
    if (caseType === 'emergency' || severity === 'critical') {
      const io = req.app.get('io');
      if (io) {
        io.emit('emergency-notification', {
          id: medicalCase._id,
          caseType: medicalCase.caseType,
          severity: medicalCase.severity,
          location: medicalCase.location,
          createdAt: medicalCase.createdAt
        });
      }
    }

    res.status(201).json({
      success: true,
      medicalCase
    });
  } catch (error) {
    console.error('Create medical case error:', error);
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

// @route   GET /api/medical/cases
// @desc    Get all medical cases
// @access  Private (Medical staff, Admin)
router.get('/cases', protect, authorize('medical', 'admin'), async (req, res) => {
  try {
    // Check MongoDB connection
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection.'
      });
    }

    const { status, caseType, severity } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (caseType) query.caseType = caseType;
    if (severity) query.severity = severity;

    const cases = await MedicalCase.find(query)
      .sort({ createdAt: -1 });

    // Manually populate fields, handling both ObjectId and string IDs (demo users)
    const casesWithPopulated = cases.map(medicalCase => {
      const caseObj = medicalCase.toObject();
      
      // Handle reportedBy for demo users
      if (typeof caseObj.reportedBy === 'string' && !mongoose.Types.ObjectId.isValid(caseObj.reportedBy)) {
        caseObj.reportedBy = { name: 'Demo User', email: '', phone: '' };
      }

      // Handle patientId for demo users
      if (typeof caseObj.patientId === 'string' && !mongoose.Types.ObjectId.isValid(caseObj.patientId)) {
        caseObj.patientId = { name: 'Demo User', email: '', phone: '' };
      }

      // Handle assignedTo
      if (caseObj.assignedTo && !mongoose.Types.ObjectId.isValid(caseObj.assignedTo)) {
        caseObj.assignedTo = null;
      }

      return caseObj;
    });

    // Populate ObjectId fields
    const populatedCases = await MedicalCase.populate(casesWithPopulated, [
      { path: 'patientId', select: 'name email phone' },
      { path: 'reportedBy', select: 'name email phone' },
      { path: 'assignedTo', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      count: populatedCases.length,
      cases: populatedCases
    });
  } catch (error) {
    console.error('Get medical cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// @route   GET /api/medical/cases/my-cases
// @desc    Get user's own medical cases
// @access  Private
router.get('/cases/my-cases', protect, async (req, res) => {
  try {
    // Check MongoDB connection
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection.'
      });
    }

    const userId = req.user?.id || req.user?._id;
    const cases = await MedicalCase.find({ 
      $or: [
        { patientId: userId },
        { reportedBy: userId }
      ]
    })
      .sort({ createdAt: -1 });

    // Manually populate assignedTo for real users, handle demo users
    const casesWithPopulated = cases.map(medicalCase => {
      const caseObj = medicalCase.toObject();
      
      // Handle assignedTo population (only for ObjectId)
      if (caseObj.assignedTo && mongoose.Types.ObjectId.isValid(caseObj.assignedTo)) {
        // Will be populated by Mongoose if it's an ObjectId
      } else {
        caseObj.assignedTo = null;
      }

      // Handle reportedBy for demo users
      if (typeof caseObj.reportedBy === 'string' && !mongoose.Types.ObjectId.isValid(caseObj.reportedBy)) {
        caseObj.reportedBy = { name: 'Demo User', email: '', phone: '' };
      }

      // Handle patientId for demo users
      if (typeof caseObj.patientId === 'string' && !mongoose.Types.ObjectId.isValid(caseObj.patientId)) {
        caseObj.patientId = { name: 'Demo User', email: '', phone: '' };
      }

      return caseObj;
    });

    // Populate assignedTo for ObjectIds
    const populatedCases = await MedicalCase.populate(casesWithPopulated, {
      path: 'assignedTo',
      select: 'name email phone'
    });

    res.json({
      success: true,
      count: populatedCases.length,
      cases: populatedCases
    });
  } catch (error) {
    console.error('Get my cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// @route   PUT /api/medical/cases/:id/assign
// @desc    Assign medical case to staff
// @access  Private (Medical, Admin)
router.put('/cases/:id/assign', protect, authorize('medical', 'admin'), [
  body('assignedTo').notEmpty().withMessage('Staff ID is required')
], async (req, res) => {
  try {
    // Check MongoDB connection
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const medicalCase = await MedicalCase.findById(req.params.id);
    
    if (!medicalCase) {
      return res.status(404).json({
        success: false,
        message: 'Medical case not found'
      });
    }

    medicalCase.assignedTo = req.body.assignedTo;
    medicalCase.status = 'in-progress';
    await medicalCase.save();

    res.json({
      success: true,
      medicalCase
    });
  } catch (error) {
    console.error('Assign case error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/medical/cases/:id/add-note
// @desc    Add note to medical case
// @access  Private (Medical, Admin)
router.put('/cases/:id/add-note', protect, authorize('medical', 'admin'), [
  body('note').trim().notEmpty().withMessage('Note is required')
], async (req, res) => {
  try {
    // Check MongoDB connection
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const medicalCase = await MedicalCase.findById(req.params.id);
    
    if (!medicalCase) {
      return res.status(404).json({
        success: false,
        message: 'Medical case not found'
      });
    }

    medicalCase.medicalNotes.push({
      note: req.body.note,
      addedBy: req.user.id
    });
    await medicalCase.save();

    res.json({
      success: true,
      medicalCase
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/medical/cases/:id/resolve
// @desc    Resolve medical case
// @access  Private (Medical, Admin)
router.put('/cases/:id/resolve', protect, authorize('medical', 'admin'), async (req, res) => {
  try {
    // Check MongoDB connection
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please check MongoDB connection.'
      });
    }

    const medicalCase = await MedicalCase.findById(req.params.id);
    
    if (!medicalCase) {
      return res.status(404).json({
        success: false,
        message: 'Medical case not found'
      });
    }

    medicalCase.status = 'resolved';
    medicalCase.resolvedAt = new Date();
    await medicalCase.save();

    res.json({
      success: true,
      medicalCase
    });
  } catch (error) {
    console.error('Resolve case error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

