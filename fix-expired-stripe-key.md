# 🔧 Fix Expired Stripe API Key

## 🚨 **Issue Identified**
Your Stripe live API key has expired:
```
StripeAuthenticationError: Expired API Key provided: sk_live_...
```

## 🛠️ **Solution Steps**

### **Step 1: Generate New Stripe API Key**

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/apikeys
2. **Click "Create key"** or "Regenerate key"
3. **Select "Live" mode** (not test)
4. **Copy the new secret key** (starts with `sk_live_`)

### **Step 2: Update Environment Variables**

Update your `server/.env` file:

```env
# Replace the expired key with your new one
STRIPE_SECRET_KEY=sk_live_your_new_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_new_publishable_key_here
```

### **Step 3: Get New Publishable Key**

Also get the corresponding publishable key:
1. In Stripe Dashboard → API Keys
2. Copy the **Publishable key** (starts with `pk_live_`)
3. Update `client/.env`:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_new_publishable_key_here
```

### **Step 4: Restart Server**

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

## 🔑 **Alternative: Use Test Keys for Development**

If you want to use test keys instead (recommended for development):

### **Test Keys Setup**
1. In Stripe Dashboard, switch to **Test mode**
2. Generate test keys:
   - Secret: `sk_test_...`
   - Publishable: `pk_test_...`

### **Update Environment**
```env
# server/.env
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key

# client/.env  
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
```

## 🧪 **Test Cards for Development**

If using test keys, use these test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expired**: `4000 0000 0000 0069`

## ⚠️ **Important Notes**

1. **Never commit API keys** to git
2. **Use test keys** for development
3. **Use live keys** only for production
4. **Keep keys secure** and rotate regularly

## 🚀 **After Fix**

Once you update the keys and restart the server:
- ✅ Subscription creation will work
- ✅ Payment processing will work
- ✅ All Stripe features will function properly

## 📞 **Need Help?**

If you need assistance:
1. Check Stripe documentation: https://stripe.com/docs/api
2. Contact Stripe support: https://support.stripe.com
3. Verify your Stripe account status
