const mongoose = require('mongoose');

const medicalCaseSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
    // Mixed type accepts both ObjectId (for real users) and String (for demo users)
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientAge: {
    type: Number,
    min: 0,
    max: 150
  },
  patientGender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  reportedBy: {
    type: mongoose.Schema.Types.Mixed,
    default: null
    // Mixed type accepts both ObjectId (for real users) and String (for demo users)
  },
  caseType: {
    type: String,
    enum: ['emergency', 'consultation', 'medication', 'checkup'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  medicalIssue: {
    type: String,
    trim: true
  },
  allergies: {
    type: String,
    trim: true,
    default: ''
  },
  emergencyContact: {
    type: String,
    trim: true,
    default: ''
  },
  symptoms: [{
    type: String
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
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
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'referred'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  medicalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
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

// Delete cached model if it exists to ensure schema changes take effect
// This is necessary when schema changes are made while server is running
if (mongoose.models.MedicalCase) {
  delete mongoose.models.MedicalCase;
  delete mongoose.connection.models.MedicalCase;
  delete mongoose.modelSchemas.MedicalCase;
}

module.exports = mongoose.model('MedicalCase', medicalCaseSchema);

