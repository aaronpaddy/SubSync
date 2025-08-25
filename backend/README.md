# SubSync Backend API

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-orange.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **SubSync Backend** - Robust API server for subscription management and Chrome extension integration.

## 🚀 Overview

The SubSync backend provides a powerful REST API for managing subscriptions, user authentication, and real-time synchronization with the Chrome extension. Built with Node.js, Express, and MongoDB for scalability and performance.

### ✨ Key Features

- **🔐 JWT Authentication**: Secure user authentication and authorization
- **📊 Subscription Management**: Full CRUD operations for subscriptions
- **🔄 Real-time Sync**: Instant updates for Chrome extension
- **📈 Analytics**: Comprehensive subscription insights and statistics
- **🔔 Notifications**: Smart renewal reminders and alerts
- **⚡ Performance**: Optimized queries and caching strategies

## 🏗️ Architecture

```
SubSync Backend/
├── 🚀 server.js           # Main server entry point
├── 🛣️ routes/             # API endpoint definitions
├── 🗄️ models/             # MongoDB schema definitions
├── 🛡️ middleware/         # Authentication & validation
├── 🛠️ utils/              # Utility functions & helpers
└── ⚙️ config/             # Configuration & environment
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 16.0.0 or higher
- **MongoDB**: 5.0.0 or higher
- **npm**: 8.0.0 or higher

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/subsync
MONGODB_URI_TEST=mongodb://localhost:27017/subsync_test

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server Configuration
PORT=5001
NODE_ENV=development

# External Services (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start

# With nodemon (auto-restart)
npm run watch
```

The server will start on `http://localhost:5001` (or the next available port).

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/auth/profile` | Get user profile |
| `PUT` | `/api/auth/profile` | Update user profile |
| `POST` | `/api/auth/logout` | User logout |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subscriptions` | Get all user subscriptions |
| `POST` | `/api/subscriptions` | Create new subscription |
| `GET` | `/api/subscriptions/:id` | Get specific subscription |
| `PUT` | `/api/subscriptions/:id` | Update subscription |
| `DELETE` | `/api/subscriptions/:id` | Delete subscription |
| `GET` | `/api/subscriptions/stats/overview` | Get subscription statistics |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Get user notifications |
| `PUT` | `/api/notifications/preferences` | Update notification preferences |
| `POST` | `/api/notifications/test` | Send test notification |

### Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/status` | Detailed server status |

## 🗄️ Data Models

### User Model

```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email address
  password: String,       // Hashed password
  phone: String,          // Phone number (optional)
  preferences: {
    notifications: {
      email: Boolean,      // Email notifications enabled
      sms: Boolean,        // SMS notifications enabled
      reminderDays: Number // Days before renewal to remind
    }
  },
  createdAt: Date,        // Account creation date
  updatedAt: Date         // Last update date
}
```

### Subscription Model

```javascript
{
  name: String,           // Subscription service name
  category: String,       // Service category (streaming, software, etc.)
  amount: Number,         // Monthly/annual cost
  billingCycle: String,   // monthly, yearly, quarterly
  nextBillingDate: Date,  // Next billing date
  isActive: Boolean,      // Subscription status
  website: String,        // Service website URL
  notes: String,          // Additional notes
  tags: [String],         // Custom tags for organization
  source: String,         // How subscription was added
  createdAt: Date,        // Creation date
  updatedAt: Date         // Last update date
}
```

### Notification Model

```javascript
{
  user: ObjectId,         // Reference to user
  subscription: ObjectId,  // Reference to subscription
  type: String,           // email, sms, push
  message: String,        // Notification content
  status: String,         // pending, sent, failed
  scheduledFor: Date,     // When to send notification
  sentAt: Date,           // When notification was sent
  error: String           // Error message if failed
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/subsync` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### CORS Configuration

The backend automatically configures CORS to allow:
- Frontend application (`http://localhost:3000`)
- Chrome extension (`chrome-extension://`)
- All origins in development mode

### Rate Limiting

- **General API**: 1000 requests per 15 minutes
- **Authentication**: 30 requests per minute
- **Subscription Creation**: 10 requests per minute

## 🛡️ Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiration**: Configurable expiration times
- **Route Protection**: Middleware-based authorization

### Data Protection

- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: MongoDB query sanitization
- **XSS Protection**: Helmet security headers
- **CORS Configuration**: Secure cross-origin requests

### API Security

- **Rate Limiting**: Prevents API abuse
- **Request Validation**: Ensures data integrity
- **Error Handling**: Secure error responses
- **Logging**: Comprehensive request logging

## 📊 Performance Optimization

### Database Optimization

- **Indexing**: Strategic database indexes
- **Query Optimization**: Efficient MongoDB queries
- **Connection Pooling**: Optimized database connections
- **Caching**: Redis integration (optional)

### API Performance

- **Response Compression**: Gzip compression
- **Request Validation**: Early validation and rejection
- **Async Operations**: Non-blocking I/O operations
- **Memory Management**: Efficient memory usage

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Environment

- **Test Database**: Separate MongoDB instance
- **Mock Services**: External service mocking
- **Test Data**: Seeded test data
- **Cleanup**: Automatic test cleanup

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=mongodb://your-production-db
   JWT_SECRET=your-production-secret
   ```

2. **Process Management**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start server.js --name "subsync-backend"
   pm2 startup
   pm2 save
   ```

3. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name api.subsync.app;
       
       location / {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

## 📈 Monitoring & Logging

### Logging

- **Request Logging**: All API requests logged
- **Error Logging**: Comprehensive error tracking
- **Performance Logging**: Response time monitoring
- **Security Logging**: Authentication and authorization events

### Health Checks

- **Database Connectivity**: MongoDB connection status
- **API Endpoints**: Endpoint availability testing
- **External Services**: Third-party service status
- **System Resources**: Memory and CPU usage

## 🔄 Chrome Extension Integration

### Real-time Sync

The backend provides instant synchronization for the Chrome extension:

- **WebSocket Support**: Real-time updates (optional)
- **Push Notifications**: Instant subscription updates
- **Badge Updates**: Extension badge synchronization
- **Context Menu**: Right-click subscription tracking

### Extension API

Special endpoints designed for extension integration:

- **Quick Add**: Fast subscription creation
- **Bulk Operations**: Multiple subscription management
- **Status Updates**: Real-time subscription status
- **Analytics**: Extension-specific statistics

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors:**
- ✅ Check MongoDB is running
- ✅ Verify connection string format
- ✅ Check network connectivity
- ✅ Verify authentication credentials

**CORS Errors:**
- ✅ Check CORS configuration
- ✅ Verify frontend URL in environment
- ✅ Check Chrome extension origin
- ✅ Review browser console errors

**Authentication Issues:**
- ✅ Verify JWT secret is set
- ✅ Check token expiration
- ✅ Verify user exists in database
- ✅ Check password hashing

**Performance Issues:**
- ✅ Check database indexes
- ✅ Monitor memory usage
- ✅ Review query performance
- ✅ Check rate limiting settings

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
DEBUG=subsync:*

# Or in code
console.log('🔍 SubSync Backend Debug Mode Enabled');
```

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow existing patterns
2. **Testing**: Add tests for new features
3. **Documentation**: Update API documentation
4. **Security**: Follow security best practices
5. **Performance**: Consider performance implications

### API Development

- **Versioning**: Use semantic versioning
- **Backward Compatibility**: Maintain API compatibility
- **Error Handling**: Consistent error responses
- **Validation**: Comprehensive input validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **Node.js Community**: For the amazing runtime
- **Express Team**: For the web framework
- **MongoDB**: For the database solution
- **SubSync Team**: For the subscription management platform

## 📞 Support

- **Documentation**: [docs.subsync.app](https://docs.subsync.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/subsync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/subsync/discussions)
- **Email**: support@subsync.app

---

**Build robust subscription management APIs with SubSync! 🚀**

*SubSync Backend - Powering intelligent subscription management.* 