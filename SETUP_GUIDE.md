# Noted.AI - Complete Setup Guide

This guide will help you set up Noted.AI for both development and production environments.

## 🚀 Quick Start (Development)

### 1. Prerequisites
- Node.js (v16 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd note.ai

# Install all dependencies
npm run install-all
```

### 3. Environment Setup

#### Backend Environment
Create `server/.env` file:
```env
# Development Environment Configuration
NODE_ENV=development
PORT=5002
FRONTEND_URL=http://localhost:3000

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/noted-ai

# OpenAI (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# JWT (Generate a strong secret)
JWT_SECRET=your_super_secure_jwt_secret_here_minimum_32_characters

# Stripe (Test Keys for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_STUDENT_PRICE_ID=price_your_student_price_id
STRIPE_UNIVERSITY_PRICE_ID=price_your_university_price_id

# Email Configuration (Optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security
SESSION_SECRET=your_session_secret_here
COOKIE_SECRET=your_cookie_secret_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,txt

# Logging
LOG_LEVEL=debug
```

#### Frontend Environment
Create `client/.env` file:
```env
REACT_APP_API_URL=http://localhost:5002/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_publishable_key
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run server  # Backend on port 5002
npm run client  # Frontend on port 3000
```

## 🔧 Required API Keys & Services

### 1. OpenAI API
- Sign up at [OpenAI](https://platform.openai.com/)
- Get your API key from the dashboard
- Add to `OPENAI_API_KEY` in environment

### 2. Stripe (for payments)
- Sign up at [Stripe](https://stripe.com/)
- Get test keys from the dashboard
- Create products and price IDs for subscriptions
- Add keys to environment variables

### 3. MongoDB
- **Local**: Install MongoDB locally
- **Cloud**: Use MongoDB Atlas (recommended for production)
- Update `MONGODB_URI` in environment

### 4. Email Service (Optional)
- **Gmail**: Use app passwords
- **SendGrid**: Recommended for production
- **AWS SES**: Enterprise option

## 🗄️ Database Setup

### MongoDB Collections
The app will automatically create these collections:
- `users` - User accounts and profiles
- `notes` - User notes and content
- `universities` - University partnerships
- `subscriptions` - Payment and subscription data

### Initial Data (Optional)
```javascript
// Create admin user
{
  "email": "admin@noted.ai",
  "password": "secure_password",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

## 🔒 Security Configuration

### JWT Secret
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Environment Variables
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate secrets regularly

## 🚀 Production Deployment

### 1. Environment Variables
Use `production.env.example` as template:
```bash
cp production.env.example server/.env
# Edit with production values
```

### 2. Build Frontend
```bash
cd client
npm run build
```

### 3. Start Production Server
```bash
npm start
```

### 4. Using Docker (Optional)
```bash
# Build and run with Docker
docker-compose up -d
```

## 🧪 Testing

### Backend Tests
```bash
# Run server tests (if implemented)
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## 📊 Monitoring & Logging

### Logs
- Application logs: `logs/app.log`
- Error monitoring: Configure Sentry DSN
- Performance: Add Google Analytics ID

### Health Checks
- Backend: `GET /api/health`
- Database: MongoDB connection status
- External APIs: OpenAI, Stripe connectivity

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string
   - Verify network access

2. **OpenAI API Errors**
   - Verify API key is correct
   - Check API quota and billing
   - Ensure proper model access

3. **Stripe Integration Issues**
   - Use correct test/live keys
   - Verify webhook configuration
   - Check price IDs exist

4. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

### Performance Optimization

1. **Database Indexing**
   - Notes: `{ user: 1, createdAt: -1 }`
   - Users: `{ email: 1 }`
   - Add compound indexes as needed

2. **Caching**
   - Redis for session storage
   - CDN for static assets
   - Browser caching headers

3. **Rate Limiting**
   - API rate limits configured
   - User-specific limits
   - Subscription-based limits

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer for multiple server instances
- Database clustering/replication
- Redis cluster for session management

### Vertical Scaling
- Increase server resources
- Database optimization
- CDN for global content delivery

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor security advisories
- Backup database regularly
- Review and rotate secrets

### Monitoring
- Set up uptime monitoring
- Configure error alerting
- Monitor API usage and costs
- Track user engagement metrics

## 📞 Support

For issues and questions:
- Check this setup guide
- Review application logs
- Contact development team
- Check GitHub issues

---

**Note**: This is a comprehensive setup guide. Follow the sections relevant to your deployment needs. 