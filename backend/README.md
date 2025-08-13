# SubTrackr Backend API

A comprehensive Node.js/Express backend for the SubTrackr subscription and bill tracking application.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Subscription Management**: CRUD operations for subscriptions and bills
- **Notification System**: Email and SMS notifications using SendGrid and Twilio
- **Statistics & Analytics**: Monthly/yearly cost breakdowns and category analysis
- **Security**: Rate limiting, helmet security headers, input validation
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: SendGrid or Nodemailer
- **SMS**: Twilio
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
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

4. **Start MongoDB**
   ```bash
   # Install MongoDB locally or use MongoDB Atlas
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
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

## Data Models

### User
- Email, password, first/last name, phone
- Notification preferences (email, SMS, reminder days)
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

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRE` | JWT expiration time | No (default: 7d) |
| `SENDGRID_API_KEY` | SendGrid API key | No (for email) |
| `EMAIL_FROM` | From email address | No |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | No (for SMS) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | No (for SMS) |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | No (for SMS) |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Mongoose schema validation
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create database named `subtrackr`
3. Collections will be created automatically

### Testing API
Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

## Deployment

1. **Environment Setup**: Configure production environment variables
2. **Database**: Set up MongoDB Atlas or production MongoDB instance
3. **Email/SMS**: Configure SendGrid and Twilio credentials
4. **Process Manager**: Use PM2 or similar for production
5. **Reverse Proxy**: Use Nginx for SSL termination and load balancing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 