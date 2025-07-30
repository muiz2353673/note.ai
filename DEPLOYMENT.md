# 🚀 Noted.AI Production Deployment Guide

## 📋 **Prerequisites**

Before deploying, ensure you have:

- [ ] Domain name (e.g., `noted.ai`)
- [ ] SSL certificate
- [ ] MongoDB Atlas account (or self-hosted MongoDB)
- [ ] Stripe account with live keys
- [ ] SendGrid account for emails
- [ ] Hosting provider account (Railway, Render, DigitalOcean, etc.)

## 🎯 **Quick Start (Recommended)**

### Option 1: Railway Deployment (Easiest)

1. **Fork/Clone the repository**
   ```bash
   git clone https://github.com/your-username/noted-ai.git
   cd noted-ai
   ```

2. **Set up Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add environment variables from `production.env.example`

3. **Deploy**
   - Railway will automatically detect the Node.js app
   - Set the build command: `npm run install-all && cd client && npm run build`
   - Set the start command: `npm start`

### Option 2: Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   # Copy production environment
   cp production.env.example server/.env
   
   # Edit environment variables
   nano server/.env
   
   # Build and start
   docker-compose up -d
   ```

### Option 3: Manual Deployment

1. **Set up production environment**
   ```bash
   cp production.env.example server/.env
   # Edit server/.env with your production values
   ```

2. **Install dependencies and build**
   ```bash
   npm run install-all
   cd client && npm run build && cd ..
   ```

3. **Start production server**
   ```bash
   NODE_ENV=production npm start
   ```

## 🔧 **Environment Configuration**

### Required Environment Variables

```bash
# Core Configuration
NODE_ENV=production
PORT=5002
FRONTEND_URL=https://noted.ai

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/noted-ai

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# JWT Security
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters

# Stripe (Live Keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STUDENT_PRICE_ID=price_...
STRIPE_UNIVERSITY_PRICE_ID=price_...

# Email (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: Monitoring
SENTRY_DSN=your-sentry-dsn
GOOGLE_ANALYTICS_ID=your-ga-id
```

## 🌐 **Domain & SSL Setup**

### 1. Domain Configuration

1. **Point your domain to your hosting provider**
   - Add A record: `@` → Your server IP
   - Add CNAME record: `www` → `@`

2. **SSL Certificate**
   - Use Let's Encrypt (free): `certbot --nginx -d noted.ai -d www.noted.ai`
   - Or use your hosting provider's SSL

### 2. Update CORS Settings

In `server/index.js`, update the CORS origin:
```javascript
origin: process.env.NODE_ENV === "production"
  ? ["https://noted.ai", "https://www.noted.ai"]
  : ["http://localhost:3000"]
```

## 📊 **Database Setup**

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas cluster**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

2. **Set up database indexes**
   ```javascript
   // Run these in MongoDB shell
   db.users.createIndex({ "email": 1 }, { unique: true })
   db.notes.createIndex({ "userId": 1, "createdAt": -1 })
   db.notes.createIndex({ "tags": 1 })
   ```

## 💳 **Stripe Configuration**

### 1. Webhook Setup

1. **Create webhook endpoint in Stripe Dashboard**
   - URL: `https://noted.ai/api/subscriptions/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

2. **Get webhook secret**
   - Copy the webhook signing secret
   - Add to `STRIPE_WEBHOOK_SECRET`

### 2. Price IDs

Ensure your price IDs are set correctly:
```bash
STRIPE_STUDENT_PRICE_ID=price_1RqSqDCPlM8I9HetZTiXYnYB
STRIPE_UNIVERSITY_PRICE_ID=price_1RqSqNCPlM8I9Het1fFxdyYk
```

## 📧 **Email Setup (SendGrid)**

1. **Create SendGrid account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Create API key
   - Verify your sender domain

2. **Configure environment variables**
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

## 🔍 **Monitoring & Analytics**

### 1. Error Monitoring (Sentry)

1. **Create Sentry project**
   - Go to [sentry.io](https://sentry.io)
   - Create new project
   - Get DSN

2. **Add to environment**
   ```bash
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

### 2. Analytics (Google Analytics)

1. **Create GA4 property**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create new property
   - Get measurement ID

2. **Add to environment**
   ```bash
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

## 🚀 **Deployment Platforms**

### Railway (Recommended)
- **Pros**: Easy setup, automatic SSL, good free tier
- **Cons**: Limited customization

### Render
- **Pros**: Good free tier, easy deployment
- **Cons**: Cold starts on free tier

### DigitalOcean App Platform
- **Pros**: Scalable, good performance
- **Cons**: More expensive

### AWS/GCP/Azure
- **Pros**: Full control, highly scalable
- **Cons**: Complex setup, requires DevOps knowledge

## 📈 **Post-Deployment Checklist**

- [ ] Test user registration and login
- [ ] Test payment flow with Stripe test cards
- [ ] Verify email notifications work
- [ ] Test AI features (summaries, flashcards)
- [ ] Check error monitoring is working
- [ ] Verify analytics tracking
- [ ] Test mobile responsiveness
- [ ] Check loading speeds
- [ ] Verify SSL certificate
- [ ] Test backup and restore procedures

## 🔒 **Security Checklist**

- [ ] All environment variables are set
- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] File upload restrictions are in place
- [ ] HTTPS is enforced
- [ ] Security headers are set
- [ ] Database is properly secured
- [ ] Regular backups are configured

## 💰 **Revenue Optimization**

### 1. Pricing Strategy
- **Free Plan**: 5 summaries, 3 flashcards, 2 assignments, 10 citations
- **Student Premium**: $9.99/month (100 summaries, 50 flashcards, 25 assignments, 200 citations)
- **University**: $99.99/month (unlimited everything)

### 2. Conversion Optimization
- Clear value proposition
- Free trial period
- Social proof and testimonials
- Easy upgrade flow
- Usage tracking and limits

### 3. Marketing Channels
- SEO optimization
- Content marketing
- Social media presence
- University partnerships
- Student ambassador program

## 🆘 **Troubleshooting**

### Common Issues

1. **Payment not working**
   - Check Stripe keys are live (not test)
   - Verify webhook is configured
   - Check price IDs are correct

2. **Emails not sending**
   - Verify SendGrid API key
   - Check sender domain is verified
   - Test SMTP connection

3. **Database connection issues**
   - Check MongoDB connection string
   - Verify network access
   - Check database indexes

4. **CORS errors**
   - Verify domain in CORS configuration
   - Check frontend URL matches backend

### Support

For deployment issues:
1. Check logs: `docker-compose logs noted-ai`
2. Verify environment variables
3. Test endpoints individually
4. Check monitoring dashboards

## 📞 **Next Steps**

After successful deployment:

1. **Launch marketing campaign**
2. **Gather user feedback**
3. **Monitor performance metrics**
4. **Iterate and improve features**
5. **Scale infrastructure as needed**

---

**Need help?** Create an issue in the GitHub repository or contact the development team. 