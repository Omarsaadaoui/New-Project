# Setup Guide - Instagram AI Helper for omar_saadaoui_officiel

This guide will walk you through setting up the Instagram AI Helper step by step.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js installed (v18 or higher) - [Download here](https://nodejs.org/)
- [ ] Instagram account: `omar_saadaoui_officiel`
- [ ] Instagram password
- [ ] OpenAI API key - [Get one here](https://platform.openai.com/api-keys)
- [ ] Terminal/Command line access
- [ ] Text editor (VS Code, Sublime, etc.)

## 🔧 Step-by-Step Setup

### Step 1: Install Node.js

Check if Node.js is installed:
```bash
node --version
```

If not installed, download from [nodejs.org](https://nodejs.org/) and install the LTS version.

### Step 2: Install Dependencies

Navigate to the project directory and install required packages:

```bash
npm install
```

This will install:
- `instagram-private-api` - Instagram API client
- `openai` - OpenAI API client
- `dotenv` - Environment variable management
- `node-cron` - Task scheduling
- `winston` - Logging
- `axios` - HTTP requests
- `sharp` - Image processing

### Step 3: Configure Environment Variables

1. **Copy the example environment file:**
```bash
cp .env.example .env
```

2. **Edit the `.env` file:**

Open `.env` in your text editor and fill in your credentials:

```env
# Instagram Account Credentials
INSTAGRAM_USERNAME=omar_saadaoui_officiel
INSTAGRAM_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE

# OpenAI API Configuration
OPENAI_API_KEY=sk-YOUR_ACTUAL_API_KEY_HERE
OPENAI_MODEL=gpt-4-turbo-preview

# AI Assistant Configuration
AI_PERSONALITY=friendly and professional
AI_LANGUAGE=french
AI_RESPONSE_STYLE=concise and engaging

# Automation Settings
AUTO_REPLY_ENABLED=true
AUTO_LIKE_ENABLED=false
AUTO_FOLLOW_ENABLED=false
MAX_REPLIES_PER_HOUR=10
MAX_LIKES_PER_HOUR=30

# Content Generation
CONTENT_TOPICS=lifestyle,motivation,business,personal_growth
POSTING_SCHEDULE=09:00,14:00,19:00

# Safety Settings
DRY_RUN_MODE=true
LOG_LEVEL=info
```

### Step 4: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Paste it in your `.env` file

**Important:** Keep your API key secret! Never share it or commit it to git.

### Step 5: Test the Setup

Run the setup test:

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           INSTAGRAM AI HELPER                                 ║
║           Account: omar_saadaoui_officiel                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

✓ Instagram Connected
  Username: @omar_saadaoui_officiel
  Followers: [your follower count]
  Posts: [your post count]

✓ OpenAI Connected
  Model: gpt-4-turbo-preview
```

### Step 6: Test AI Response Generation

Test if AI responses work correctly:

```bash
npm start test
```

This will generate a sample AI response to verify everything is working.

## 🎯 First Steps After Setup

### 1. Test Auto-Reply (Dry Run)

With `DRY_RUN_MODE=true`, test the auto-reply feature:

```bash
npm run auto-reply
```

This will:
- Fetch recent comments and DMs
- Generate AI responses
- Show what would be posted (without actually posting)

### 2. Generate Sample Content

Create some sample Instagram captions:

```bash
npm run generate-content single motivation inspirational
```

Review the generated content to see if it matches your style.

### 3. Check Analytics

View your current Instagram analytics:

```bash
npm run analytics report
```

### 4. Customize AI Personality

Edit your `.env` file to customize how the AI responds:

```env
# For a more casual tone:
AI_PERSONALITY=casual and friendly with a touch of humor
AI_LANGUAGE=french
AI_RESPONSE_STYLE=conversational and relatable

# For a professional tone:
AI_PERSONALITY=professional and authoritative
AI_LANGUAGE=french
AI_RESPONSE_STYLE=formal and informative

# For an inspirational tone:
AI_PERSONALITY=warm and inspirational
AI_LANGUAGE=french
AI_RESPONSE_STYLE=motivational and uplifting
```

## 🚀 Going Live

Once you're satisfied with testing:

### 1. Disable Dry Run Mode

Edit `.env`:
```env
DRY_RUN_MODE=false
```

### 2. Start with Low Rate Limits

Keep rate limits conservative at first:
```env
MAX_REPLIES_PER_HOUR=5
```

### 3. Monitor Closely

- Check logs regularly: `tail -f logs/combined.log`
- Review AI responses in `data/processed_comments.json`
- Monitor Instagram for any issues

### 4. Gradually Increase Automation

After a few days of successful operation:
- Increase rate limits gradually
- Enable more features
- Expand content topics

## 📁 Directory Structure

After setup, your project will have:

```
instagram-ai-helper/
├── node_modules/          # Installed dependencies (auto-generated)
├── src/                   # Source code
├── data/                  # Local data storage (auto-generated)
├── logs/                  # Application logs (auto-generated)
├── .env                   # Your configuration (DO NOT COMMIT)
├── .env.example           # Example configuration
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
├── README.md             # Main documentation
└── SETUP_GUIDE.md        # This file
```

## 🔒 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Never share your `.env` file
- [ ] Keep OpenAI API key secret
- [ ] Use strong Instagram password
- [ ] Enable 2FA on Instagram account
- [ ] Regularly review logs for suspicious activity
- [ ] Start with `DRY_RUN_MODE=true`

## ⚠️ Common Issues and Solutions

### Issue: "Cannot find module"
**Solution:** Run `npm install` again

### Issue: "Instagram login failed"
**Solution:** 
- Verify username and password in `.env`
- Check if 2FA is enabled (may need app password)
- Try logging in manually to Instagram first

### Issue: "OpenAI API error"
**Solution:**
- Verify API key is correct
- Check OpenAI account has credits
- Ensure API key has proper permissions

### Issue: "Rate limit exceeded"
**Solution:**
- Reduce `MAX_REPLIES_PER_HOUR`
- Wait before retrying
- Check Instagram hasn't flagged your account

### Issue: "No comments found"
**Solution:**
- Ensure your posts are public
- Check if you have recent posts with comments
- Verify account permissions

## 📞 Getting Help

If you encounter issues:

1. **Check the logs:**
   ```bash
   cat logs/error.log
   ```

2. **Review configuration:**
   ```bash
   cat .env
   ```

3. **Test individual components:**
   ```bash
   npm start test
   ```

4. **Verify dependencies:**
   ```bash
   npm list
   ```

## 🎓 Learning Resources

- [Instagram API Documentation](https://developers.facebook.com/docs/instagram-api)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Node.js Documentation](https://nodejs.org/docs)

## ✅ Setup Complete!

Once you see successful test results, you're ready to use the Instagram AI Helper!

**Next steps:**
1. Read the main [README.md](README.md) for usage instructions
2. Customize AI personality to match your brand
3. Start with dry run mode
4. Monitor and adjust as needed

**Remember:** Always use automation responsibly and in compliance with Instagram's Terms of Service.

---

**Account:** omar_saadaoui_officiel  
**Setup Guide Version:** 1.0.0  
**Last Updated:** October 2024
