const express = require('express');
const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');
const { auth } = require('../middleware/auth');
const { sendEmail, sendSMS } = require('../utils/notifications');

const router = express.Router();

// Get user's notification preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    res.json({
      preferences: req.user.preferences
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, reminderDays } = req.body;
    
    const updates = {};
    if (emailNotifications !== undefined) updates['preferences.emailNotifications'] = emailNotifications;
    if (smsNotifications !== undefined) updates['preferences.smsNotifications'] = smsNotifications;
    if (reminderDays !== undefined) updates['preferences.reminderDays'] = reminderDays;

    const user = await req.user.constructor.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Notification preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

// Get notification history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const notifications = await Notification.find(filter)
      .populate('subscription', 'name amount nextBillingDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(filter);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification history' });
  }
});

// Send test notification
router.post('/test', auth, async (req, res) => {
  try {
    const { type, message } = req.body;

    if (!['email', 'sms'].includes(type)) {
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    let success = false;
    let error = null;

    if (type === 'email' && req.user.preferences.emailNotifications) {
      try {
        await sendEmail(req.user.email, 'SubTrackr Test Notification', message);
        success = true;
      } catch (emailError) {
        error = emailError.message;
      }
    } else if (type === 'sms' && req.user.preferences.smsNotifications && req.user.phone) {
      try {
        await sendSMS(req.user.phone, message);
        success = true;
      } catch (smsError) {
        error = smsError.message;
      }
    } else {
      return res.status(400).json({ 
        error: `${type.toUpperCase()} notifications are not enabled or phone number not provided` 
      });
    }

    if (success) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(500).json({ error: `Failed to send test notification: ${error}` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Manually trigger notifications for a subscription
router.post('/trigger/:subscriptionId', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.subscriptionId,
      user: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const notifications = [];

    // Create email notification if enabled
    if (req.user.preferences.emailNotifications) {
      const emailMessage = `Your subscription "${subscription.name}" is due on ${subscription.nextBillingDate.toLocaleDateString()}. Amount: $${subscription.amount}`;
      
      const emailNotification = new Notification({
        user: req.user._id,
        subscription: subscription._id,
        type: 'email',
        message: emailMessage,
        scheduledFor: new Date(),
        status: 'pending'
      });

      try {
        await sendEmail(req.user.email, 'SubTrackr - Subscription Reminder', emailMessage);
        emailNotification.status = 'sent';
        emailNotification.sentAt = new Date();
      } catch (error) {
        emailNotification.status = 'failed';
        emailNotification.error = error.message;
      }

      await emailNotification.save();
      notifications.push(emailNotification);
    }

    // Create SMS notification if enabled
    if (req.user.preferences.smsNotifications && req.user.phone) {
      const smsMessage = `SubTrackr: ${subscription.name} due ${subscription.nextBillingDate.toLocaleDateString()}. $${subscription.amount}`;
      
      const smsNotification = new Notification({
        user: req.user._id,
        subscription: subscription._id,
        type: 'sms',
        message: smsMessage,
        scheduledFor: new Date(),
        status: 'pending'
      });

      try {
        await sendSMS(req.user.phone, smsMessage);
        smsNotification.status = 'sent';
        smsNotification.sentAt = new Date();
      } catch (error) {
        smsNotification.status = 'failed';
        smsNotification.error = error.message;
      }

      await smsNotification.save();
      notifications.push(smsNotification);
    }

    res.json({
      message: 'Notifications triggered successfully',
      notifications
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger notifications' });
  }
});

// Get notification statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Notification.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          sent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'sent'] }, 1, 0]
            }
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      typeStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notification statistics' });
  }
});

module.exports = router; 