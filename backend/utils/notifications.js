const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email configuration
const createEmailTransporter = () => {
  // For development, use a test account or configure with your email service
  return nodemailer.createTransporter({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// SendGrid configuration (alternative to nodemailer)
let sendGridMail = null;
try {
  sendGridMail = require('@sendgrid/mail');
  if (process.env.SENDGRID_API_KEY) {
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
} catch (error) {
  console.log('SendGrid not available, using nodemailer fallback');
}

// Twilio configuration
let twilioClient = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_ACCOUNT_SID.startsWith('AC') &&
      process.env.TWILIO_AUTH_TOKEN.length > 0) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (error) {
  console.log('Twilio not configured properly, SMS notifications will be disabled');
}

// Send email notification
const sendEmail = async (to, subject, message) => {
  try {
    // Check if any email service is configured
    const hasSendGrid = sendGridMail && process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here';
    const hasGmail = process.env.EMAIL_USER && process.env.EMAIL_PASS && 
                     process.env.EMAIL_USER !== 'your_gmail@gmail.com' && 
                     process.env.EMAIL_PASS !== 'your_gmail_app_password';
    
    if (hasSendGrid) {
      // Use SendGrid
      const msg = {
        to,
        from: process.env.EMAIL_FROM || 'noreply@subtrackr.com',
        subject,
        text: message,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">SubTrackr Notification</h2>
          <p>${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated notification from SubTrackr.
          </p>
        </div>`
      };
      
      await sendGridMail.send(msg);
      console.log(`Email sent successfully to ${to} via SendGrid`);
    } else if (hasGmail) {
      // Use nodemailer with Gmail
      const transporter = createEmailTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text: message,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">SubTrackr Notification</h2>
          <p>${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated notification from SubTrackr.
          </p>
        </div>`
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to} via Gmail SMTP`);
    } else {
      // No email service configured - log for testing
      console.log('📧 Email would be sent:');
      console.log('  To:', to);
      console.log('  Subject:', subject);
      console.log('  Message:', message);
      console.log('  (No email service configured - update .env file)');
      return true; // Return success for testing
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send SMS notification
const sendSMS = async (to, message) => {
  try {
    if (!twilioClient) {
      throw new Error('Twilio not configured');
    }
    
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio phone number not configured');
    }
    
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    
    console.log(`SMS sent successfully to ${to}`);
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

// Generate notification message
const generateNotificationMessage = (subscription, daysUntilDue) => {
  const dueDate = subscription.nextBillingDate.toLocaleDateString();
  const amount = subscription.amount;
  const name = subscription.name;
  
  if (daysUntilDue === 0) {
    return `Your subscription "${name}" is due today! Amount: $${amount}`;
  } else if (daysUntilDue === 1) {
    return `Your subscription "${name}" is due tomorrow! Amount: $${amount}`;
  } else {
    return `Your subscription "${name}" is due in ${daysUntilDue} days (${dueDate}). Amount: $${amount}`;
  }
};

// Check and send due notifications
const checkAndSendNotifications = async () => {
  try {
    const Subscription = require('../models/Subscription');
    const User = require('../models/User');
    const Notification = require('../models/Notification');
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find subscriptions due today or tomorrow
    const dueSubscriptions = await Subscription.find({
      isActive: true,
      nextBillingDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('user');
    
    for (const subscription of dueSubscriptions) {
      const user = subscription.user;
      if (!user || !user.isActive) continue;
      
      const daysUntilDue = Math.ceil(
        (subscription.nextBillingDate - today) / (1000 * 60 * 60 * 24)
      );
      
      const message = generateNotificationMessage(subscription, daysUntilDue);
      
      // Send email notification
      if (user.preferences.emailNotifications) {
        try {
          await sendEmail(user.email, 'SubTrackr - Subscription Due', message);
          
          // Save notification record
          await new Notification({
            user: user._id,
            subscription: subscription._id,
            type: 'email',
            message,
            scheduledFor: new Date(),
            status: 'sent',
            sentAt: new Date()
          }).save();
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
        }
      }
      
      // Send SMS notification
      if (user.preferences.smsNotifications && user.phone) {
        try {
          await sendSMS(user.phone, message);
          
          // Save notification record
          await new Notification({
            user: user._id,
            subscription: subscription._id,
            type: 'sms',
            message,
            scheduledFor: new Date(),
            status: 'sent',
            sentAt: new Date()
          }).save();
        } catch (error) {
          console.error(`Failed to send SMS to ${user.phone}:`, error);
        }
      }
    }
    
    console.log(`Processed ${dueSubscriptions.length} due subscriptions`);
  } catch (error) {
    console.error('Notification check failed:', error);
  }
};

module.exports = {
  sendEmail,
  sendSMS,
  generateNotificationMessage,
  checkAndSendNotifications
}; 