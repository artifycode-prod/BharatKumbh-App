const mongoose = require('mongoose');

const qrRegistrationSchema = new mongoose.Schema({
  qrCodeId: {
    type: String,
    required: true,
    trim: true
  },
  entryPoint: {
    type: String,
    required: true,
    enum: ['railway_station', 'bus_stand', 'parking_area', 'other'],
    trim: true
  },
  entryPointName: {
    type: String,
    required: true,
    trim: true
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  groupSize: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  luggageCount: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  intendedDestination: {
    type: String,
    required: true,
    enum: ['Tapovan', 'Panchvati', 'Trambak', 'Ramkund', 'Kalaram', 'Sita Gufa', 'Other'],
    trim: true
  },
  customDestination: {
    type: String,
    trim: true
  },
  groupSelfie: {
    type: String, // URL or file path
    required: true
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
    name: {
      type: String,
      default: ''
    }
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
qrRegistrationSchema.index({ qrCodeId: 1, registeredAt: -1 });
qrRegistrationSchema.index({ intendedDestination: 1, registeredAt: -1 });
qrRegistrationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('QRRegistration', qrRegistrationSchema);


