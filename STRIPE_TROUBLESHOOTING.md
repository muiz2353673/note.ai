# 🔧 Stripe Integration Troubleshooting Guide

## 🚨 **Critical Issues Found & Fixed**

### **1. Key Mismatch Issue (FIXED)**

**Problem**: Server using test keys, client using live keys
**Solution**: Updated both to use matching live keys

### **2. Invalid Price IDs (FIXED)**

**Problem**: Placeholder price IDs (`price_student_monthly`)
**Solution**: Updated to real Stripe price IDs

### **3. Missing Webhook Secret (NEEDS ACTION)**

**Problem**: Placeholder webhook secret
**Solution**: Set up webhook endpoint in Stripe dashboard

## 🛠️ **Step-by-Step Fix**

### **Step 1: Run the Fix Script**

```bash
chmod +x fix-stripe-config.sh
./fix-stripe-config.sh
```

### **Step 2: Set Up Stripe Webhook**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set URL: `https://yourdomain.com/api/subscriptions/webhook`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook secret
6. Update `STRIPE_WEBHOOK_SECRET` in `server/.env`

### **Step 3: Test the Integration**

```bash
# Restart the server
npm run dev

# Test payment flow
# 1. Go to pricing page
# 2. Click "Subscribe" on any plan
# 3. Use Stripe test card: 4242 4242 4242 4242
```

## 🔍 **Common Error Messages & Solutions**

### **"Invalid API key provided"**

- Check that `STRIPE_SECRET_KEY` is correct
- Ensure no extra spaces or characters
- Verify you're using live keys for production

### **"No such price"**

- Verify `STRIPE_STUDENT_PRICE_ID` and `STRIPE_UNIVERSITY_PRICE_ID`
- Check that price IDs exist in your Stripe dashboard
- Ensure price IDs are for the correct currency

### **"Payment method not found"**

- Check that payment method is properly attached to customer
- Verify customer creation in Stripe dashboard
- Ensure payment method is valid

### **"Webhook signature verification failed"**

- Update `STRIPE_WEBHOOK_SECRET` with correct value
- Ensure webhook endpoint URL is correct
- Check that webhook events are properly configured

## 🧪 **Testing Checklist**

### **Frontend Testing**

- [ ] Payment modal opens correctly
- [ ] Card element renders properly
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Success redirect works

### **Backend Testing**

- [ ] Customer creation works
- [ ] Payment method attachment works
- [ ] Subscription creation works
- [ ] Webhook processing works
- [ ] Error handling works

### **Integration Testing**

- [ ] End-to-end payment flow
- [ ] Subscription status updates
- [ ] Feature access based on plan
- [ ] Billing history retrieval
- [ ] Subscription cancellation

## 🔐 **Security Best Practices**

### **Environment Variables**

- Never commit `.env` files to git
- Use different keys for development/production
- Rotate keys regularly
- Use strong, unique secrets

### **Error Handling**

- Don't expose sensitive data in error messages
- Log errors securely
- Implement proper validation
- Use HTTPS in production

### **Webhook Security**

- Verify webhook signatures
- Use HTTPS endpoints
- Implement idempotency
- Handle duplicate events

## 📞 **Getting Help**

### **Stripe Support**

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://community.stripe.com)

### **Debug Tools**

- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Logs](https://dashboard.stripe.com/logs)

## 🚀 **Production Checklist**

- [ ] Use live Stripe keys
- [ ] Set up webhook endpoint
- [ ] Configure SSL certificate
- [ ] Set up monitoring
- [ ] Test with real cards
- [ ] Implement error tracking
- [ ] Set up backup payment methods
- [ ] Configure fraud detection
