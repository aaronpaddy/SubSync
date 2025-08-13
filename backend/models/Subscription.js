const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'streaming',
      'music',
      'software',
      'gaming',
      'fitness',
      'education',
      'utilities',
      'rent',
      'insurance',
      'membership',
      'other'
    ],
    default: 'other'
  },
  description: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  billingCycle: {
    type: String,
    required: [true, 'Billing cycle is required'],
    enum: ['monthly', 'quarterly', 'yearly', 'weekly', 'daily']
  },
  nextBillingDate: {
    type: Date,
    required: [true, 'Next billing date is required']
  },
  trialEndDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  website: {
    type: String,
    trim: true
  },
  accountEmail: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  paymentMethod: {
    type: String,
    trim: true
  },
  lastPaymentDate: {
    type: Date
  },
  totalPaid: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ user: 1, nextBillingDate: 1 });
subscriptionSchema.index({ user: 1, category: 1 });
subscriptionSchema.index({ nextBillingDate: 1, isActive: 1 });

// Virtual for annual cost
subscriptionSchema.virtual('annualCost').get(function() {
  const cycleMultipliers = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    quarterly: 4,
    yearly: 1
  };
  return this.amount * cycleMultipliers[this.billingCycle];
});

// Method to check if subscription is due soon
subscriptionSchema.methods.isDueSoon = function(days = 7) {
  const now = new Date();
  const dueDate = new Date(this.nextBillingDate);
  const diffTime = dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
};

// Method to get next billing date
subscriptionSchema.methods.getNextBillingDate = function() {
  const currentDate = new Date(this.nextBillingDate);
  const cycleMultipliers = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    yearly: 365
  };
  
  const daysToAdd = cycleMultipliers[this.billingCycle];
  currentDate.setDate(currentDate.getDate() + daysToAdd);
  return currentDate;
};

module.exports = mongoose.model('Subscription', subscriptionSchema); 