const express = require('express');
const User = require('../models/User');
const SOS = require('../models/SOS');
const LostFound = require('../models/LostFound');
const MedicalCase = require('../models/MedicalCase');
// Authentication disabled for development
// const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are now public (no authentication required)
// Uncomment below to enable authentication in production:
// router.use(protect);
// router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  console.log('📥 GET /api/admin/dashboard request received');
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
    
    console.log('🔍 Querying dashboard statistics...');
    
    const totalUsers = await User.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalMedicalStaff = await User.countDocuments({ role: 'medical' });
    const pendingSOS = await SOS.countDocuments({ status: 'pending' });
    const resolvedSOS = await SOS.countDocuments({ status: 'resolved' });
    const openLostFound = await LostFound.countDocuments({ status: 'open' });
    const resolvedLostFound = await LostFound.countDocuments({ status: 'resolved' });
    const pendingMedicalCases = await MedicalCase.countDocuments({ status: 'pending' });
    const resolvedMedicalCases = await MedicalCase.countDocuments({ status: 'resolved' });

    console.log('✅ Dashboard statistics retrieved');

    res.json({
      success: true,
      dashboard: {
        users: {
          total: totalUsers,
          volunteers: totalVolunteers,
          medicalStaff: totalMedicalStaff
        },
        sos: {
          pending: pendingSOS,
          resolved: resolvedSOS
        },
        lostFound: {
          open: openLostFound,
          resolved: resolvedLostFound
        },
        medical: {
          pending: pendingMedicalCases,
          resolved: resolvedMedicalCases
        }
      }
    });
  } catch (error) {
    console.error('❌ Get admin dashboard error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/admin/users/:id/activate
// @desc    Activate user account
// @access  Private/Admin
router.put('/users/:id/activate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/deactivate
// @desc    Deactivate user account
// @access  Private/Admin
router.put('/users/:id/deactivate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

