const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');
// Rate limiting disabled - uncomment to enable
// const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Test endpoint to verify demo logins and server version
router.get('/test-demo-logins', (req, res) => {
  const demoLogins = {
    'admin@kumbh.com': { password: 'admin', role: 'admin', name: 'Admin User' },
    'admin': { password: 'admin', role: 'admin', name: 'Admin User' },
    'volunteer@kumbh.com': { password: 'volunteer', role: 'volunteer', name: 'Volunteer User' },
    'volunteer': { password: 'volunteer', role: 'volunteer', name: 'Volunteer User' },
    'medical@kumbh.com': { password: 'medical', role: 'medical', name: 'Medical Team User' },
    'medical': { password: 'medical', role: 'medical', name: 'Medical Team User' },
    'pilgrim@kumbh.com': { password: 'pilgrim123', role: 'pilgrim', name: 'Pilgrim User' }
  };
  res.json({
    success: true,
    message: 'Demo logins available - Server code version: 2.0',
    serverTime: new Date().toISOString(),
    demoLogins: Object.keys(demoLogins).map(key => ({
      email: key,
      password: demoLogins[key].password,
      role: demoLogins[key].role
    }))
  });
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', /* authLimiter, */ [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['pilgrim', 'volunteer', 'admin', 'medical']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'pilgrim'
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', /* authLimiter, */ [
  body('email').notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    
    // Log immediately to verify request is received
    console.log('========================================');
    console.log('📥 LOGIN REQUEST RECEIVED');
    console.log('📥 Raw request body:', JSON.stringify({ email, passwordType: typeof password, passwordLength: password?.length }));
    console.log('📥 Full req.body:', JSON.stringify(req.body));
    console.log('========================================');

    // Demo login credentials (for development/testing)
    // Keep these logins same and refer to user role
    const demoLogins = {
      'admin@kumbh.com': { password: 'admin', role: 'admin', name: 'Admin User' },
      'admin': { password: 'admin', role: 'admin', name: 'Admin User' },
      'volunteer@kumbh.com': { password: 'volunteer', role: 'volunteer', name: 'Volunteer User' },
      'volunteer': { password: 'volunteer', role: 'volunteer', name: 'Volunteer User' },
      'medical@kumbh.com': { password: 'medical', role: 'medical', name: 'Medical Team User' },
      'medical': { password: 'medical', role: 'medical', name: 'Medical Team User' },
      'pilgrim@kumbh.com': { password: 'pilgrim123', role: 'pilgrim', name: 'Pilgrim User' }
    };

    // Check if it's a demo login
    const normalizedEmail = (email || '').toLowerCase().trim();
    const normalizedPassword = String(password || '').trim();
    
    console.log('🔐 Login attempt:', JSON.stringify({ 
      originalEmail: email, 
      normalizedEmail, 
      originalPassword: password,
      normalizedPassword,
      passwordLength: normalizedPassword.length
    }));
    
    // Check demo logins FIRST - before any database lookup
    const demoLogin = demoLogins[normalizedEmail];
    
    console.log('📋 Demo login check:', { 
      normalizedEmail,
      found: !!demoLogin, 
      expectedPassword: demoLogin?.password,
      receivedPassword: normalizedPassword,
      passwordMatch: demoLogin?.password === normalizedPassword,
      expectedLength: demoLogin?.password?.length,
      receivedLength: normalizedPassword.length,
      allDemoKeys: Object.keys(demoLogins)
    });
    
    // DEMO LOGIN CHECK - ALWAYS RUNS FIRST
    // This is the primary authentication method for development
    if (demoLogin) {
      // Demo login found - check password
      const passwordMatches = demoLogin.password === normalizedPassword;
      
      console.log('🔑 DEMO LOGIN CHECK:');
      console.log('   Email:', normalizedEmail, '✅ Found in demo logins');
      console.log('   Expected password:', `"${demoLogin.password}"`, `(type: ${typeof demoLogin.password}, length: ${demoLogin.password.length})`);
      console.log('   Received password:', `"${normalizedPassword}"`, `(type: ${typeof normalizedPassword}, length: ${normalizedPassword.length})`);
      console.log('   Password match:', passwordMatches ? '✅ YES' : '❌ NO');
      
      if (passwordMatches) {
        // SUCCESS - Generate token and return
        console.log('✅✅✅ DEMO LOGIN SUCCESSFUL!');
        const demoUserId = `demo-${demoLogin.role}`;
        const token = generateToken(demoUserId);

        const response = {
          success: true,
          token,
          user: {
            id: demoUserId,
            name: demoLogin.name,
            email: normalizedEmail.includes('@') ? normalizedEmail : `${normalizedEmail}@kumbh.com`,
            phone: '0000000000',
            role: demoLogin.role
          }
        };
        
        console.log('✅ Returning success response');
        return res.json(response);
      } else {
        // Password mismatch
        console.log('❌❌❌ PASSWORD MISMATCH');
        return res.status(401).json({
          success: false,
          message: `Invalid password. Expected: "${demoLogin.password}", Received: "${normalizedPassword}"`
        });
      }
    }
    
    // If we reach here, no demo login was found
    console.log('⚠️⚠️⚠️ NO DEMO LOGIN FOUND');
    console.log('   Requested email:', normalizedEmail);
    console.log('   Available demo emails:', Object.keys(demoLogins).join(', '));
    console.log('   Falling back to database lookup...');

    // Regular database login
    // Find user and include password for comparison
    console.log('🔍 Trying database lookup for:', normalizedEmail);
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/update-location
// @desc    Update user location
// @access  Private
router.put('/update-location', protect, [
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

    const { latitude, longitude } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'location.latitude': latitude,
        'location.longitude': longitude,
        'location.lastUpdated': new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

