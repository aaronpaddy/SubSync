const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['email', 'sms', 'push']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'sent', 'failed', 'delivered'],
    default: 'pending'
  },
  message: {
    type: String,
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  },
  sentAt: {
    type: Date
  },
  error: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, scheduledFor: 1 });
notificationSchema.index({ status: 1, scheduledFor: 1 });
notificationSchema.index({ subscription: 1, type: 1 });

module.exports = mongoose.model('Notification', notificationSchema); 