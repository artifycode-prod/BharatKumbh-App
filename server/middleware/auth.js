const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('❌ No token provided in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided'
      });
    }
    
    console.log('🔑 Token received:', token.substring(0, 20) + '...');

    try {
      // Verify token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      console.log('🔐 Verifying token with secret:', jwtSecret ? 'SET' : 'NOT SET');
      const decoded = jwt.verify(token, jwtSecret);
      console.log('✅ Token decoded successfully:', { id: decoded.id, exp: decoded.exp });
      
      // Handle demo users (IDs starting with "demo-")
      if (decoded.id && decoded.id.startsWith('demo-')) {
        // Create a virtual user object for demo users
        const role = decoded.id.replace('demo-', '');
        const demoUsers = {
          'pilgrim': { id: 'demo-pilgrim', role: 'pilgrim', name: 'Pilgrim User', email: 'pilgrim@kumbh.com', phone: '0000000000', isActive: true },
          'volunteer': { id: 'demo-volunteer', role: 'volunteer', name: 'Volunteer User', email: 'volunteer@kumbh.com', phone: '0000000000', isActive: true },
          'admin': { id: 'demo-admin', role: 'admin', name: 'Admin User', email: 'admin@kumbh.com', phone: '0000000000', isActive: true },
          'medical': { id: 'demo-medical', role: 'medical', name: 'Medical Team User', email: 'medical@kumbh.com', phone: '0000000000', isActive: true }
        };
        
        const demoUser = demoUsers[role];
        if (demoUser) {
          req.user = {
            id: demoUser.id,
            _id: demoUser.id,
            role: demoUser.role,
            name: demoUser.name,
            email: demoUser.email,
            phone: demoUser.phone,
            isActive: demoUser.isActive
          };
          next();
          return;
        }
      }
      
      // Get user from token (for real database users)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      console.log('✅ User authenticated:', { id: req.user.id, role: req.user.role });
      next();
    } catch (err) {
      console.error('❌ Token verification error:', err.message);
      console.error('Token error details:', {
        name: err.name,
        message: err.message,
        expiredAt: err.expiredAt
      });
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Token invalid or expired',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

