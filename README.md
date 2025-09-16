# SubSync - Subscription Management & Tracking

[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-v1.0.0-blue.svg)](https://chrome.google.com/webstore)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://nodejs.org/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue.svg)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-orange.svg)](https://mongodb.com/)

> **SubSync** - Seamlessly track and manage your subscriptions across the web with intelligent detection and real-time synchronization.

## 🚀 What is SubSync?

SubSync formelly substrackr is a comprehensive subscription management solution that combines a powerful web application with a smart Chrome extension. It automatically detects subscription services on websites, tracks your spending, and provides insights to help you manage your recurring expenses.

### ✨ Key Features

- **📊 Visual Dashboard**: Monthly cost breakdown with charts and statistics
- **🔔 Smart Notifications**: Email and SMS alerts before due dates
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🔐 Secure Authentication**: JWT-based user authentication
- **📈 Analytics**: Spending insights and category analysis
- **⚙️ Customizable**: Set reminder preferences and notification settings
- **📋 Export Data**: Export subscription data for budgeting
- **🎯 Trial Tracking**: Monitor free trial end dates
- **🔍 Smart Detection**: Automatically detects subscription services on any website
- **📱 Chrome Extension**: Seamless integration with your browsing experience
- **🔄 Real-time Sync**: Instant synchronization between extension and web app
- **🌐 Cross-platform**: Access your data from anywhere via the web dashboard

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

### Chrome Extension
- **Manifest V3** for modern Chrome compatibility
- **Content Scripts** for page detection
- **Background Service Worker** for persistent functionality
- **Popup Interface** for quick access

## 🏗️ Architecture

```
SubSync/
├── 🎯 Chrome Extension     # Smart subscription detection
├── 🌐 Frontend (React)     # Web dashboard & management
├── ⚙️ Backend (Node.js)    # API & business logic
└── 🗄️ Database (MongoDB)   # Data persistence
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Chrome browser (for extension)

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/subsync.git
cd subsync
./setup.sh
```

### 2. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm start
```

The backend will start on `http://localhost:5001` (or next available port).

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The web app will open at `http://localhost:3000`.

### 4. Install Chrome Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension/` folder
5. Pin SubSync to your toolbar

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/subsync
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_FROM=noreply@subsync.com
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Extension Settings

The Chrome extension automatically configures itself based on your backend URL. No manual configuration required!

## 📱 Extension Features

### Smart Detection
- **Pattern Matching**: Recognizes subscription keywords and pricing
- **Domain Validation**: Ensures accurate service identification
- **Price Extraction**: Automatically detects subscription costs
- **Service Categorization**: Organizes by type (streaming, software, etc.)

### User Experience
- **Floating Action Button**: Always accessible, non-intrusive
- **Quick Add Dialog**: Simple subscription addition process
- **Real-time Feedback**: Success/error notifications
- **Seamless Integration**: Works on any website

## 🌐 Web App Features

### Dashboard
- **Overview Cards**: Active subscriptions, monthly spending, total count
- **Recent Subscriptions**: Quick access to recently added services
- **Quick Actions**: Add new subscriptions, view full dashboard

### Subscription Management
- **CRUD Operations**: Create, read, update, delete subscriptions
- **Billing Cycles**: Track monthly, yearly, and custom cycles
- **Status Management**: Active, paused, or cancelled subscriptions
- **Category Organization**: Group by service type

### Analytics
- **Spending Trends**: Monthly and yearly expense analysis
- **Service Breakdown**: Visual representation of subscription costs
- **Renewal Calendar**: Upcoming billing dates and reminders

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/:id` - Get subscription by ID
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `GET /api/subscriptions/stats/overview` - Get subscription statistics
- `GET /api/subscriptions/due-soon` - Get subscriptions due soon
- `PUT /api/subscriptions/:id/renew` - Renew subscription

### Notifications
- `GET /api/notifications/preferences` - Get notification preferences
- `PUT /api/notifications/preferences` - Update notification preferences
- `GET /api/notifications/history` - Get notification history
- `POST /api/notifications/test` - Send test notification
- `POST /api/notifications/trigger/:subscriptionId` - Trigger notifications
- `GET /api/notifications/stats` - Get notification statistics

## 📁 Project Structure

```
subsync/
├── chrome-extension/          # Chrome extension files
│   ├── manifest.json         # Extension configuration
│   ├── content.js           # Page detection script
│   ├── popup.js            # Extension popup logic
│   ├── background.js       # Background service worker
│   └── test-simple.html    # Testing page
├── frontend/                 # React web application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript definitions
│   │   └── services/       # API service functions
│   └── public/             # Static assets
├── backend/                  # Node.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── server.js           # Main server file
└── setup.sh                 # Automated setup script
```

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

### Chrome Extension Usage
1. **Visit a subscription service website** (e.g., netflix.com)
2. **Look for the floating blue button** in the top right corner
3. **Click the button** to see detected services with confidence scores
4. **Add subscriptions** with one click - prices and billing cycles are auto-detected

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: 1000 requests per 15 minutes
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for frontend and extension
- **Helmet Security**: Security headers

## 📊 Data Models

### User
- Email, password, first/last name, phone
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

### Extension Deployment
1. Build the extension: `cd chrome-extension && node build.js`
2. Upload to Chrome Web Store
3. Or distribute as unpacked extension

## 🧪 Testing

### Extension Testing
1. **Extension Testing**: Use `chrome-extension/test-simple.html`
2. **API Testing**: Use Postman or curl with `http://localhost:5001`
3. **Frontend Testing**: Run `npm test` in the frontend directory

### Manual Testing
1. **Visit real websites**:
   - `netflix.com` → Should detect Netflix
   - `spotify.com` → Should detect Spotify
   - `amazon.com` → Should detect Amazon Prime

2. **Check console logs** for debugging information
3. **Verify API calls** in Network tab
4. **Test authentication** flow

## 🐛 Troubleshooting

### Common Issues

**Extension not detecting subscriptions:**
- ✅ Ensure you're logged into the web app
- ✅ Check browser console for errors
- ✅ Verify backend is running on correct port

**CORS errors:**
- ✅ Check backend CORS configuration
- ✅ Ensure frontend URL is whitelisted
- ✅ Verify environment variables

**Database connection issues:**
- ✅ Check MongoDB is running
- ✅ Verify connection string in `.env`
- ✅ Check network connectivity

**Extension not loading:**
- ✅ Check Chrome's developer console for errors
- ✅ Verify all files are in the correct directory
- ✅ Ensure manifest.json is valid JSON

**API connection errors:**
- ✅ Verify your backend is running
- ✅ Check API endpoint URLs
- ✅ Ensure CORS is properly configured

### Debug Mode

Enable debug logging in the extension:

```javascript
// In content.js or popup.js
console.log('🔍 SubSync Debug Mode Enabled');
```

## 📈 Roadmap

### Upcoming Features
- [ ] **Mobile App**: iOS and Android applications
- [ ] **Browser Extensions**: Firefox and Safari support
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Team Management**: Shared subscription tracking
- [ ] **Export Features**: CSV, PDF, and API exports
- [ ] **Integration APIs**: Connect with financial apps

### Recent Updates
- ✅ **Smart Detection**: Improved accuracy with domain validation
- ✅ **Real-time Sync**: Instant updates across all platforms
- ✅ **Enhanced UI**: Modern, responsive design
- ✅ **Performance**: Optimized loading and caching
- ✅ **Security**: Enhanced authentication and validation
- ✅ **Chrome Extension**: Intelligent subscription detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Test extension on multiple websites
- Ensure cross-browser compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chrome Extension API**: For extension development capabilities
- **React Community**: For the amazing frontend framework
- **Node.js Ecosystem**: For robust backend development
- **MongoDB**: For flexible data storage solutions
- **Material-UI**: For the beautiful UI components
- **SendGrid**: For email services
- **Twilio**: For SMS services

## 📞 Support

- **Documentation**: [docs.subsync.app](https://docs.subsync.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/subsync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/subsync/discussions)
- **Email**: support@subsync.app

---

*Transform how you manage subscriptions with intelligent detection and seamless synchronization.* 