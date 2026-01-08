const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.Mixed,
    required: true
    // Mixed type accepts both ObjectId (for real users) and String (for demo users like 'demo-pilgrim')
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      default: ''
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ''
    }
  },
  images: [{
    type: String // URLs or file paths
  }],
  isPerson: {
    type: Boolean,
    default: false
  },
  facialRecognitionData: {
    type: String, // Base64 or feature vector for face matching
    default: null
  },
  matchedWithQRRegistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRRegistration',
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'matched', 'resolved', 'closed'],
    default: 'open'
  },
  matchedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LostFound',
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  strict: true // Ensure strict mode is enabled
});

module.exports = mongoose.model('LostFound', lostFoundSchema);

