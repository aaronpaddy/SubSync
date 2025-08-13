# SubTrackr – Subscription & Bill Tracker

A comprehensive web application to help users manage and track all their subscriptions and recurring bills in one place. Users receive timely alerts before auto-renewals or payment deadlines, reducing the risk of unexpected charges.

## 🚀 Features

- **📊 Visual Dashboard**: Monthly cost breakdown with charts and statistics
- **🔔 Smart Notifications**: Email and SMS alerts before due dates
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🔐 Secure Authentication**: JWT-based user authentication
- **📈 Analytics**: Spending insights and category analysis
- **⚙️ Customizable**: Set reminder preferences and notification settings
- **📋 Export Data**: Export subscription data for budgeting
- **🎯 Trial Tracking**: Monitor free trial end dates

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **SendGrid** for email notifications
- **Twilio** for SMS notifications

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subtrackr
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/subtrackr
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_FROM=noreply@subtrackr.com
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
subtrackr/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication & validation
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── types/       # TypeScript definitions
│   │   └── services/    # API service functions
│   └── public/          # Static assets
└── README.md
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `GET /api/subscriptions/stats/overview` - Get statistics

### Notifications
- `GET /api/notifications/preferences` - Get preferences
- `PUT /api/notifications/preferences` - Update preferences
- `POST /api/notifications/test` - Send test notification

## 🎯 Usage

### Getting Started
1. Register a new account
2. Add your first subscription
3. Configure notification preferences
4. Monitor your dashboard

### Adding Subscriptions
- Name and categorize your subscription
- Set billing amount and cycle
- Add next billing date
- Configure auto-renewal settings
- Add notes and tags

### Managing Notifications
- Enable email/SMS notifications
- Set reminder days (1-30 days before)
- Test notification delivery
- View notification history

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for frontend
- **Helmet Security**: Security headers

## 📊 Data Models

### User
- Email, password, name, phone
- Notification preferences
- Account status

### Subscription
- Name, category, amount, billing cycle
- Next billing date, trial end date
- Auto-renewal settings, payment method
- Website, account email, notes, tags

### Notification
- User, subscription reference
- Type (email, SMS, push)
- Status, message, scheduled time
- Error tracking

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or production MongoDB
2. Configure environment variables
3. Set up SendGrid and Twilio credentials
4. Deploy to Heroku, Railway, or AWS

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Netlify, Vercel, or AWS S3
3. Configure environment variables
4. Set up custom domain (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for the beautiful UI components
- MongoDB for the database
- SendGrid for email services
- Twilio for SMS services
- React community for the amazing ecosystem

## 📞 Support

For support, email support@subtrackr.com or create an issue in the repository.

---

**Made with ❤️ for better subscription management** 