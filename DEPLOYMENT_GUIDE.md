# 🚀 **Noted.AI Deployment Guide**

## **Option 1: Railway Deployment (Recommended)**

### **Step 1: Create GitHub Repository**
1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New repository"
3. Name: `noted-ai`
4. Description: `AI-powered academic assistant with note summarization, flashcards, and assignment help`
5. Make it **Public** (for free Railway deployment)
6. Click "Create repository"

### **Step 2: Push to GitHub**
```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/noted-ai.git

# Push to GitHub
git push -u origin main
```

### **Step 3: Deploy to Railway**
1. Go to [Railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `noted-ai` repository
5. Railway will automatically detect it's a Node.js app

### **Step 4: Configure Environment Variables**
In Railway dashboard, go to your project → Variables tab and add:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe (Live Keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STUDENT_PRICE_ID=price_1RqSqDCPlM8I9HetZTiXYnYB
STRIPE_UNIVERSITY_PRICE_ID=price_1RqSqNCPlM8I9Het1fFxdyYk

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Email (Optional for production)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com

# Environment
NODE_ENV=production
PORT=5002
```

### **Step 5: Set Build Command**
In Railway → Settings → Build & Deploy:
- **Build Command**: `npm install && cd client && npm install && npm run build`
- **Start Command**: `npm start`

### **Step 6: Add Custom Domain (Optional)**
1. In Railway → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## **Option 2: Docker Deployment**

### **Local Docker Test**
```bash
# Build and run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f
```

### **Production Docker Deployment**
```bash
# Build production image
docker build -t noted-ai .

# Run with environment variables
docker run -d \
  -p 5002:5002 \
  -e MONGODB_URI=your_mongodb_uri \
  -e OPENAI_API_KEY=your_openai_key \
  -e JWT_SECRET=your_jwt_secret \
  -e NODE_ENV=production \
  noted-ai
```

## **Option 3: Manual Server Deployment**

### **Prerequisites**
- Ubuntu 20.04+ server
- Node.js 18+
- MongoDB
- Nginx
- PM2 (for process management)

### **Deployment Steps**
1. **Clone repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/noted-ai.git
   cd noted-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd client && npm install && npm run build
   cd ..
   ```

3. **Set up environment**:
   ```bash
   cp production.env.example .env
   # Edit .env with your production values
   ```

4. **Install PM2**:
   ```bash
   npm install -g pm2
   ```

5. **Start application**:
   ```bash
   pm2 start server/index.js --name "noted-ai"
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx**:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/noted-ai
   sudo ln -s /etc/nginx/sites-available/noted-ai /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## **Post-Deployment Checklist**

### ✅ **Essential Checks**
- [ ] Application loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] AI features work (with fallback)
- [ ] Payment system works
- [ ] Database connection is stable
- [ ] Environment variables are set correctly

### ✅ **Security Checks**
- [ ] HTTPS is enabled
- [ ] Environment variables are secure
- [ ] JWT secret is strong
- [ ] API rate limiting is active
- [ ] CORS is configured properly

### ✅ **Performance Checks**
- [ ] Page load times are acceptable
- [ ] AI responses are timely
- [ ] Database queries are optimized
- [ ] Static assets are cached

## **Monitoring & Maintenance**

### **Logs**
- Railway: Built-in logging in dashboard
- Docker: `docker-compose logs -f`
- Manual: `pm2 logs noted-ai`

### **Updates**
```bash
# Pull latest changes
git pull origin main

# Restart application
# Railway: Automatic
# Docker: docker-compose down && docker-compose up -d
# Manual: pm2 restart noted-ai
```

### **Backup**
- MongoDB: Set up automated backups
- Files: Regular backups of configuration
- Environment: Document all variables

## **Troubleshooting**

### **Common Issues**
1. **Build fails**: Check Node.js version and dependencies
2. **Database connection**: Verify MongoDB URI and network access
3. **AI features down**: Check OpenAI API key and quota
4. **Payment issues**: Verify Stripe keys and webhook configuration

### **Support**
- Check logs for error messages
- Verify environment variables
- Test endpoints with curl or Postman
- Monitor Railway/Docker logs

## **Revenue Generation**

Once deployed:
1. **Share your app** with students and educators
2. **Create social media content** about AI study tools
3. **Partner with universities** for bulk licensing
4. **Monitor usage** and optimize conversion rates
5. **Collect feedback** and iterate on features

**Your Noted.AI app is now ready to start making money! 🚀💰** 