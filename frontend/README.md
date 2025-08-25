# SubSync Frontend

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.x-green.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **SubSync Frontend** - Modern React web application for comprehensive subscription management and analytics.

## 🚀 Overview

The SubSync frontend is a powerful, responsive web application built with React and TypeScript. It provides an intuitive interface for managing subscriptions, viewing analytics, and integrating seamlessly with the Chrome extension.

### ✨ Key Features

- **📊 Interactive Dashboard**: Real-time subscription overview and statistics
- **🎨 Modern UI**: Beautiful Material-UI design with dark/light themes
- **📱 Responsive Design**: Works perfectly on all devices
- **🔄 Real-time Sync**: Instant updates from Chrome extension
- **📈 Advanced Analytics**: Comprehensive spending insights and trends
- **🔔 Smart Notifications**: Renewal reminders and alerts
- **⚡ Performance**: Optimized rendering and lazy loading

## 🏗️ Architecture

```
SubSync Frontend/
├── 🎯 src/                 # Source code
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── types/            # TypeScript definitions
│   ├── services/         # API service functions
│   └── utils/            # Utility functions
├── 🎨 public/            # Static assets
├── 📦 package.json       # Dependencies
└── ⚙️ tsconfig.json      # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 16.0.0 or higher
- **npm**: 8.0.0 or higher
- **SubSync Backend**: Running on port 5001

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5001
REACT_APP_EXTENSION_ID=your-extension-id

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true

# External Services (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

### 3. Start Development Server

```bash
# Development mode
npm start

# Production build
npm run build

# Test mode
npm test
```

The application will open at `http://localhost:3000`.

## 🎯 Core Features

### Dashboard

- **Overview Cards**: Active subscriptions, monthly spending, total count
- **Recent Activity**: Latest subscription changes and updates
- **Quick Actions**: Add subscriptions, view analytics, manage settings
- **Real-time Updates**: Live data synchronization

### Subscription Management

- **CRUD Operations**: Create, read, update, delete subscriptions
- **Bulk Operations**: Manage multiple subscriptions at once
- **Advanced Filtering**: Search by name, category, amount, status
- **Import/Export**: CSV and JSON data handling

### Analytics & Insights

- **Spending Trends**: Monthly and yearly expense analysis
- **Category Breakdown**: Visual representation of subscription costs
- **Renewal Calendar**: Upcoming billing dates and reminders
- **Cost Projections**: Future spending predictions

### User Experience

- **Responsive Design**: Mobile-first approach
- **Theme Support**: Light and dark mode
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized loading and caching

## 🛠️ Technical Stack

### Core Technologies

- **React 18**: Latest React with concurrent features
- **TypeScript 4.x**: Type-safe development
- **Material-UI 5**: Modern component library
- **React Router 6**: Client-side routing

### State Management

- **React Context**: Lightweight state management
- **Local Storage**: Persistent user preferences
- **Session Storage**: Temporary session data

### API Integration

- **Axios**: HTTP client with interceptors
- **JWT Authentication**: Secure token-based auth
- **Real-time Updates**: WebSocket integration (optional)

### Development Tools

- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks
- **Jest**: Unit testing framework

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/         # Layout components
│   ├── Dashboard/      # Dashboard-specific components
│   ├── Subscriptions/  # Subscription management
│   ├── Analytics/      # Charts and insights
│   └── Common/         # Shared components
├── pages/              # Page components
│   ├── Dashboard/      # Main dashboard
│   ├── Subscriptions/  # Subscription list
│   ├── Analytics/      # Analytics page
│   ├── Settings/       # User settings
│   └── Auth/          # Authentication pages
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx # Theme management
├── types/              # TypeScript definitions
│   ├── index.ts        # Main type exports
│   ├── subscription.ts # Subscription types
│   └── user.ts         # User types
├── services/           # API services
│   ├── api.ts         # Base API configuration
│   ├── auth.ts        # Authentication service
│   └── subscriptions.ts # Subscription service
└── utils/              # Utility functions
    ├── date.ts         # Date formatting
    ├── currency.ts     # Currency formatting
    └── validation.ts   # Form validation
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5001` |
| `REACT_APP_EXTENSION_ID` | Chrome extension ID | Optional |
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics | `true` |
| `REACT_APP_ENABLE_NOTIFICATIONS` | Enable notifications | `true` |

### API Configuration

The frontend automatically configures API communication:

```typescript
// services/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Theme Configuration

Customize the Material-UI theme:

```typescript
// contexts/ThemeContext.tsx
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch

# E2E tests (if configured)
npm run test:e2e
```

### Test Structure

```
__tests__/
├── components/         # Component tests
├── pages/             # Page tests
├── services/          # Service tests
└── utils/             # Utility tests
```

### Testing Guidelines

- **Component Testing**: Test component rendering and interactions
- **Service Testing**: Mock API calls and test business logic
- **Integration Testing**: Test component interactions
- **Accessibility Testing**: Ensure WCAG compliance

## 🚀 Development

### Development Workflow

1. **Setup Environment**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

2. **Start Development**
   ```bash
   npm start
   ```

3. **Make Changes**
   - Edit source files
   - View changes in browser
   - Hot reload enabled

4. **Quality Checks**
   ```bash
   npm run lint        # Code quality
   npm run format      # Code formatting
   npm test           # Run tests
   ```

### Code Quality

- **ESLint**: Enforce coding standards
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety and IntelliSense
- **Husky**: Pre-commit quality checks

### Performance Optimization

- **Code Splitting**: Lazy load components
- **Memoization**: Prevent unnecessary re-renders
- **Bundle Analysis**: Monitor bundle size
- **Image Optimization**: Compress and lazy load images

## 🔒 Security Features

### Authentication

- **JWT Tokens**: Secure token storage
- **Route Protection**: Protected routes for authenticated users
- **Token Refresh**: Automatic token renewal
- **Secure Storage**: Encrypted local storage

### Data Protection

- **Input Validation**: Client-side form validation
- **XSS Prevention**: Sanitized user inputs
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security-focused HTTP headers

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

### Mobile-First Approach

- **Touch-Friendly**: Optimized for touch devices
- **Progressive Enhancement**: Core functionality on all devices
- **Performance**: Optimized for mobile networks
- **Accessibility**: Mobile accessibility features

## 🌐 Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deployment Options

1. **Netlify**
   ```bash
   npm run build
   # Drag build folder to Netlify
   ```

2. **Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **AWS S3 + CloudFront**
   ```bash
   aws s3 sync build/ s3://your-bucket
   ```

4. **Docker**
   ```dockerfile
   FROM nginx:alpine
   COPY build/ /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

### Environment Configuration

Update environment variables for production:

```bash
REACT_APP_API_URL=https://api.subsync.app
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
```

## 🔄 Chrome Extension Integration

### Real-time Updates

The frontend integrates seamlessly with the Chrome extension:

- **Live Sync**: Instant subscription updates
- **Badge Updates**: Extension badge synchronization
- **Context Menus**: Right-click subscription tracking
- **Push Notifications**: Real-time alerts

### Extension Communication

```typescript
// Listen for extension messages
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  if (event.data.type === 'SUBSCRIPTION_ADDED') {
    // Refresh subscription data
    refreshSubscriptions();
  }
});
```

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
- ✅ Check Node.js version (16+)
- ✅ Clear npm cache: `npm cache clean --force`
- ✅ Delete node_modules and reinstall
- ✅ Check TypeScript errors

**Runtime Errors:**
- ✅ Check browser console for errors
- ✅ Verify API endpoint configuration
- ✅ Check environment variables
- ✅ Verify backend is running

**Performance Issues:**
- ✅ Check bundle size with `npm run build`
- ✅ Monitor network requests
- ✅ Check for memory leaks
- ✅ Verify lazy loading is working

### Debug Mode

Enable debug logging:

```typescript
// In any component
console.log('🔍 SubSync Frontend Debug Mode Enabled');

// Or set environment variable
REACT_APP_DEBUG=true
```

## 📈 Performance Metrics

### Core Web Vitals

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Performance Targets

- **Initial Load**: < 3s
- **Time to Interactive**: < 5s
- **Bundle Size**: < 500KB (gzipped)
- **API Response**: < 200ms

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow existing patterns
2. **Testing**: Add tests for new features
3. **Documentation**: Update component documentation
4. **Accessibility**: Ensure WCAG compliance
5. **Performance**: Consider performance implications

### Component Development

- **Props Interface**: Define clear prop types
- **Default Props**: Provide sensible defaults
- **Error Boundaries**: Handle component errors gracefully
- **Loading States**: Show loading indicators

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Material-UI**: For the beautiful component library
- **TypeScript**: For type safety and developer experience
- **SubSync Team**: For the subscription management platform

## 📞 Support

- **Documentation**: [docs.subsync.app](https://docs.subsync.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/subsync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/subsync/discussions)
- **Email**: support@subsync.app

---

**Build beautiful subscription management interfaces with SubSync! 🚀**

*SubSync Frontend - Where design meets functionality.*
