const express = require('express');
const Subscription = require('../models/Subscription');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all subscriptions for user
router.get('/', auth, async (req, res) => {
  try {
    const { category, isActive, search, sortBy = 'nextBillingDate', sortOrder = 'asc' } = req.query;
    
    const filter = { user: req.user._id };
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const subscriptions = await Subscription.find(filter)
      .sort(sortOptions)
      .populate('user', 'firstName lastName email');

    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get subscription by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'firstName lastName email');

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create new subscription
router.post('/', auth, async (req, res) => {
  try {
    const subscriptionData = {
      ...req.body,
      user: req.user._id
    };

    const subscription = new Subscription(subscriptionData);
    await subscription.save();

    const populatedSubscription = await subscription.populate('user', 'firstName lastName email');

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: populatedSubscription
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Update subscription
router.put('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email');

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Delete subscription
router.delete('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
});

// Get subscription statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Subscription.aggregate([
      { $match: { user: req.user._id, isActive: true } },
      {
        $group: {
          _id: null,
          totalMonthly: {
            $sum: {
              $cond: [
                { $eq: ['$billingCycle', 'monthly'] },
                '$amount',
                {
                  $cond: [
                    { $eq: ['$billingCycle', 'yearly'] },
                    { $divide: ['$amount', 12] },
                    {
                      $cond: [
                        { $eq: ['$billingCycle', 'quarterly'] },
                        { $divide: ['$amount', 3] },
                        {
                          $cond: [
                            { $eq: ['$billingCycle', 'weekly'] },
                            { $multiply: ['$amount', 4.33] },
                            { $multiply: ['$amount', 30] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          },
          totalYearly: {
            $sum: {
              $cond: [
                { $eq: ['$billingCycle', 'yearly'] },
                '$amount',
                {
                  $cond: [
                    { $eq: ['$billingCycle', 'monthly'] },
                    { $multiply: ['$amount', 12] },
                    {
                      $cond: [
                        { $eq: ['$billingCycle', 'quarterly'] },
                        { $multiply: ['$amount', 4] },
                        {
                          $cond: [
                            { $eq: ['$billingCycle', 'weekly'] },
                            { $multiply: ['$amount', 52] },
                            { $multiply: ['$amount', 365] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get category breakdown
    const categoryStats = await Subscription.aggregate([
      { $match: { user: req.user._id, isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Get upcoming renewals (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingRenewals = await Subscription.find({
      user: req.user._id,
      isActive: true,
      nextBillingDate: { $lte: thirtyDaysFromNow }
    }).sort({ nextBillingDate: 1 }).limit(10);

    res.json({
      overview: stats[0] || { totalMonthly: 0, totalYearly: 0, count: 0 },
      categoryStats,
      upcomingRenewals
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get subscriptions due soon
router.get('/due-soon', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const dueSoon = await Subscription.find({
      user: req.user._id,
      isActive: true,
      nextBillingDate: { $lte: dueDate }
    }).sort({ nextBillingDate: 1 });

    res.json({ dueSoon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch due subscriptions' });
  }
});

// Update next billing date (for renewals)
router.put('/:id/renew', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Update next billing date and last payment date
    subscription.nextBillingDate = subscription.getNextBillingDate();
    subscription.lastPaymentDate = new Date();
    subscription.totalPaid += subscription.amount;

    await subscription.save();

    const populatedSubscription = await subscription.populate('user', 'firstName lastName email');

    res.json({
      message: 'Subscription renewed successfully',
      subscription: populatedSubscription
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to renew subscription' });
  }
});

module.exports = router; 