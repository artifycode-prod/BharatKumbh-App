const express = require('express');
const SOS = require('../models/SOS');
const LostFound = require('../models/LostFound');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require volunteer, admin, or medical role
router.use(protect);
router.use(authorize('volunteer', 'admin', 'medical'));

// @route   GET /api/volunteer/dashboard
// @desc    Get volunteer dashboard data
// @access  Private (Volunteer, Admin, Medical)
router.get('/dashboard', async (req, res) => {
  try {
    const pendingSOS = await SOS.countDocuments({ status: 'pending' });
    const myAssignedSOS = await SOS.countDocuments({ 
      assignedTo: req.user.id,
      status: { $in: ['pending', 'acknowledged'] }
    });
    const openLostFound = await LostFound.countDocuments({ status: 'open' });

    res.json({
      success: true,
      dashboard: {
        pendingSOS,
        myAssignedSOS,
        openLostFound
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/volunteer/assigned-tasks
// @desc    Get assigned SOS tasks
// @access  Private (Volunteer, Admin, Medical)
router.get('/assigned-tasks', async (req, res) => {
  try {
    const tasks = await SOS.find({ 
      assignedTo: req.user.id,
      status: { $in: ['pending', 'acknowledged'] }
    })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get assigned tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

