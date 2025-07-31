# 🚀 GPT Version Upgrade Guide

## 🤖 Available GPT Models

### Current Setup
- **Free Users**: `gpt-3.5-turbo` (good performance, cost-effective)
- **Premium Users**: `gpt-4o` (best performance, advanced capabilities)
- **Fallback**: Custom AI responses (when API key is missing)

### Model Comparison

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| `gpt-3.5-turbo` | Fast | Good | Low | General use, quick responses |
| `gpt-4o` | Medium | Excellent | Medium | Complex tasks, high quality |
| `gpt-4-turbo` | Slow | Excellent | High | Most complex tasks |
| `fallback` | Instant | Basic | Free | When API is unavailable |

## 🔧 How to Enable Higher GPT Versions

### Step 1: Get OpenAI API Key

1. **Visit OpenAI Platform**
   - Go to [https://platform.openai.com/](https://platform.openai.com/)
   - Sign up or log in to your account

2. **Create API Key**
   - Navigate to "API Keys" section
   - Click "Create new secret key"
   - Give it a name (e.g., "Noted.AI Production")
   - Copy the key (starts with `sk-`)

3. **Check API Access**
   - Go to "Usage" section
   - Verify you have access to GPT-4 models
   - Check your billing and credits

### Step 2: Update Environment Variables

**Option A: Manual Update**
```bash
# Edit server/.env file
nano server/.env

# Replace this line:
OPENAI_API_KEY=your_openai_api_key_here

# With your real API key:
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Option B: Command Line Update**
```bash
# Replace with your actual API key
sed -i '' 's/your_openai_api_key_here/sk-your-actual-api-key-here/' server/.env
```

### Step 3: Restart the Application
```bash
# Stop the current server
pkill -f "node"

# Restart with new configuration
npm run dev
```

## 🎯 Model Selection Logic

The app now intelligently selects the best model based on:

### User Subscription Level
- **Free Users**: `gpt-3.5-turbo`
- **Student Premium**: `gpt-4o`
- **University Premium**: `gpt-4o`

### API Availability
- **Valid API Key**: Uses OpenAI models
- **Invalid/Missing Key**: Uses fallback responses

### Error Handling
- **Rate Limits**: Falls back to lower model
- **Model Unavailable**: Uses fallback
- **API Errors**: Graceful degradation

## 💰 Cost Considerations

### GPT-3.5-turbo (Recommended for most users)
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens
- **Typical cost**: $0.01-0.05 per request

### GPT-4o (Premium users)
- **Input**: $0.005 per 1K tokens
- **Output**: $0.015 per 1K tokens
- **Typical cost**: $0.05-0.20 per request

### Cost Optimization Tips
1. **Start with GPT-3.5-turbo** for testing
2. **Use GPT-4o** only for premium features
3. **Monitor usage** in OpenAI dashboard
4. **Set spending limits** to control costs

## 🔍 Testing Your Setup

### 1. Check API Key
```bash
# Test if your API key works
curl -H "Authorization: Bearer sk-your-api-key" \
     https://api.openai.com/v1/models
```

### 2. Test AI Features
1. Go to http://localhost:3000
2. Log in to your account
3. Try AI summarization
4. Check the response shows the correct model

### 3. Verify Model Usage
Look for these indicators:
- **Response shows**: `"model": "gpt-4o"` (premium users)
- **Response shows**: `"model": "gpt-3.5-turbo"` (free users)
- **Response shows**: `"model": "fallback"` (no API key)

## 🛠️ Troubleshooting

### Common Issues

**"Invalid API Key" Error**
```bash
# Check your API key format
echo $OPENAI_API_KEY | head -c 10
# Should show: sk-12345678
```

**"Model Not Found" Error**
- Check if you have access to GPT-4 models
- Verify your OpenAI account billing
- Try using `gpt-3.5-turbo` first

**High Costs**
- Set spending limits in OpenAI dashboard
- Use GPT-3.5-turbo for testing
- Monitor usage regularly

### Debug Commands
```bash
# Check environment variables
cat server/.env | grep OPENAI

# Test API connectivity
curl -s http://localhost:5002/api/health

# Check server logs
tail -f logs/app.log
```

## 📊 Usage Monitoring

### OpenAI Dashboard
- Monitor usage at [https://platform.openai.com/usage](https://platform.openai.com/usage)
- Set spending limits
- View request logs

### Application Monitoring
- Check user usage in the app dashboard
- Monitor API response times
- Track feature usage patterns

## 🎉 Benefits of Higher GPT Versions

### GPT-4o Advantages
- **Better Understanding**: More nuanced comprehension
- **Higher Quality**: More accurate and detailed responses
- **Advanced Reasoning**: Better problem-solving capabilities
- **Multimodal**: Can handle images and complex content

### When to Use Each Model
- **GPT-3.5-turbo**: General note summarization, basic flashcards
- **GPT-4o**: Complex assignments, detailed analysis, research help
- **Fallback**: When API is unavailable or for testing

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Rotate API keys** regularly
4. **Monitor usage** for unusual activity
5. **Set spending limits** to prevent unexpected charges

---

**🎯 Ready to upgrade? Follow the steps above and enjoy the enhanced AI capabilities!** 