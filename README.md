# Instagram AI Helper for omar_saadaoui_officiel

An intelligent Instagram automation assistant powered by AI that helps manage the `omar_saadaoui_officiel` Instagram account with automated replies, content generation, scheduling, and analytics.

## 🌟 Features

### 1. **AI-Powered Auto-Reply**
- Automatically responds to comments on your posts
- Replies to direct messages intelligently
- Content moderation to filter inappropriate messages
- Rate limiting to avoid Instagram restrictions
- Maintains your brand voice and personality

### 2. **Content Generation**
- Generate engaging Instagram captions using AI
- Multiple content styles: motivational, educational, inspirational, storytelling
- Weekly content planning
- Hashtag generation
- Caption improvement suggestions

### 3. **Post Scheduling**
- Schedule posts for optimal times
- Automated posting at configured intervals
- Manage and cancel scheduled posts
- View upcoming content calendar

### 4. **Analytics & Insights**
- Comprehensive engagement metrics
- Growth tracking over time
- AI-powered insights and recommendations
- Top-performing content analysis
- Follower growth trends

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Instagram account credentials
- OpenAI API key

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

3. **Edit `.env` file with your credentials:**
```env
# Instagram Account
INSTAGRAM_USERNAME=omar_saadaoui_officiel
INSTAGRAM_PASSWORD=your_password_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# AI Configuration
AI_PERSONALITY=friendly and professional
AI_LANGUAGE=french
AI_RESPONSE_STYLE=concise and engaging

# Safety
DRY_RUN_MODE=true  # Set to false when ready for production
```

4. **Test the setup:**
```bash
npm start
```

## 📖 Usage Guide

### Auto-Reply Bot

Automatically respond to comments and DMs:

```bash
npm run auto-reply
```

**Features:**
- Fetches recent comments and DMs
- Generates contextual AI responses
- Moderates content for safety
- Respects rate limits (configurable)
- Tracks all interactions

**Configuration:**
- `MAX_REPLIES_PER_HOUR`: Maximum automated replies per hour (default: 10)
- `AUTO_REPLY_ENABLED`: Enable/disable auto-replies
- `DRY_RUN_MODE`: Test mode without actually posting

### Content Generator

Generate AI-powered content for your Instagram:

**Single Post:**
```bash
npm run generate-content single motivation inspirational
```

**Multiple Posts:**
```bash
npm run generate-content multiple 5
```

**Weekly Content Plan:**
```bash
npm run generate-content weekly
```

**Generate Hashtags:**
```bash
npm run generate-content hashtags "Your caption text here"
```

**Improve Caption:**
```bash
npm run generate-content improve "Your existing caption"
```

**Content Topics:**
Configure in `.env`:
```env
CONTENT_TOPICS=lifestyle,motivation,business,personal_growth
```

### Post Scheduler

Schedule and manage your Instagram posts:

**Start Scheduler:**
```bash
npm run schedule-post start
```

**Schedule a Post:**
```bash
npm run schedule-post schedule "Your caption here" "2024-12-01T09:00:00"
```

**List Scheduled Posts:**
```bash
npm run schedule-post list
```

**Cancel a Post:**
```bash
npm run schedule-post cancel [postId]
```

**Posting Schedule:**
Configure in `.env`:
```env
POSTING_SCHEDULE=09:00,14:00,19:00
```

### Analytics

Track performance and get insights:

**Full Analytics Report:**
```bash
npm run analytics report
```

**Track Growth:**
```bash
npm run analytics growth
```

**Compare Timeframes:**
```bash
npm run analytics compare 30
```

**Metrics Included:**
- Follower count and growth rate
- Engagement rate
- Average likes and comments per post
- Top-performing content
- AI interaction statistics
- Growth trends over time

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `INSTAGRAM_USERNAME` | Your Instagram username | Required |
| `INSTAGRAM_PASSWORD` | Your Instagram password | Required |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `OPENAI_MODEL` | AI model to use | gpt-4-turbo-preview |
| `AI_PERSONALITY` | Bot personality | friendly and professional |
| `AI_LANGUAGE` | Response language | french |
| `AI_RESPONSE_STYLE` | Response style | concise and engaging |
| `AUTO_REPLY_ENABLED` | Enable auto-replies | true |
| `MAX_REPLIES_PER_HOUR` | Rate limit for replies | 10 |
| `MAX_LIKES_PER_HOUR` | Rate limit for likes | 30 |
| `CONTENT_TOPICS` | Content generation topics | lifestyle,motivation,business |
| `POSTING_SCHEDULE` | Posting times | 09:00,14:00,19:00 |
| `DRY_RUN_MODE` | Test mode (no actual posting) | true |
| `LOG_LEVEL` | Logging verbosity | info |

### AI Personality Customization

Customize how the AI responds by editing these variables:

```env
AI_PERSONALITY=friendly and professional
AI_LANGUAGE=french
AI_RESPONSE_STYLE=concise and engaging
```

Examples:
- `AI_PERSONALITY=casual and humorous`
- `AI_PERSONALITY=formal and business-oriented`
- `AI_PERSONALITY=warm and inspirational`

## 🛡️ Safety Features

### Dry Run Mode
Test all features without actually posting to Instagram:
```env
DRY_RUN_MODE=true
```

### Content Moderation
All incoming messages are automatically moderated using OpenAI's moderation API to filter:
- Inappropriate content
- Spam
- Harassment
- Harmful content

### Rate Limiting
Built-in rate limiting prevents:
- Instagram API restrictions
- Account flagging
- Excessive automation

### Data Privacy
- All data stored locally in `./data` directory
- No external data sharing
- Credentials stored in `.env` (gitignored)

## 📁 Project Structure

```
instagram-ai-helper/
├── src/
│   ├── config/
│   │   ├── instagram.js      # Instagram API client
│   │   └── openai.js          # OpenAI API client
│   ├── utils/
│   │   ├── logger.js          # Logging utility
│   │   └── database.js        # Local data storage
│   ├── auto-reply.js          # Auto-reply bot
│   ├── content-generator.js   # Content generation
│   ├── scheduler.js           # Post scheduling
│   ├── analytics.js           # Analytics engine
│   └── index.js               # Main entry point
├── data/                      # Local data storage
├── logs/                      # Application logs
├── .env                       # Configuration (create from .env.example)
├── .env.example               # Example configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔍 Troubleshooting

### Instagram Login Issues

**Problem:** Can't login to Instagram
**Solutions:**
1. Verify credentials in `.env`
2. Check if 2FA is enabled (may need app-specific password)
3. Instagram may require verification - check your email/phone
4. Try logging in manually first to verify account status

### OpenAI API Errors

**Problem:** AI responses failing
**Solutions:**
1. Verify API key is correct
2. Check API quota/billing
3. Ensure model name is correct
4. Check internet connection

### Rate Limiting

**Problem:** "Rate limit reached" messages
**Solutions:**
1. Reduce `MAX_REPLIES_PER_HOUR`
2. Increase delays between actions
3. Use `DRY_RUN_MODE` for testing
4. Wait before retrying

### No Comments/DMs Found

**Problem:** Bot reports no new content
**Solutions:**
1. Ensure account has recent activity
2. Check if posts are public
3. Verify account permissions
4. Check Instagram API status

## 📊 Data Storage

All data is stored locally in the `./data` directory:

- `processed_comments.json` - Replied comments history
- `processed_dms.json` - Replied DMs history
- `generated_content.json` - Generated captions
- `scheduled_posts.json` - Scheduled posts queue
- `published_posts.json` - Published posts history
- `analytics_reports.json` - Analytics reports
- `growth_tracking.json` - Growth metrics over time
- `flagged_comments.json` - Moderated content
- `flagged_dms.json` - Moderated messages

## 🤝 Best Practices

1. **Start with Dry Run Mode**
   - Test all features with `DRY_RUN_MODE=true`
   - Verify AI responses are appropriate
   - Check rate limits work correctly

2. **Monitor Regularly**
   - Check logs in `./logs` directory
   - Review analytics weekly
   - Adjust AI personality as needed

3. **Gradual Automation**
   - Start with low rate limits
   - Increase gradually as you gain confidence
   - Always review AI-generated content

4. **Content Quality**
   - Review generated captions before scheduling
   - Customize AI personality to match your brand
   - Use analytics to improve content strategy

5. **Account Safety**
   - Never share credentials
   - Use strong passwords
   - Enable 2FA on Instagram
   - Keep API keys secure

## 📝 License

MIT License - Created by 3amrouch

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs in `./logs` directory
3. Ensure all dependencies are installed
4. Verify configuration in `.env`

## 🎯 Roadmap

Future enhancements:
- [ ] Image generation for posts
- [ ] Story automation
- [ ] Hashtag research and optimization
- [ ] Competitor analysis
- [ ] Advanced sentiment analysis
- [ ] Multi-account support
- [ ] Web dashboard
- [ ] Mobile notifications

---

**Note:** This tool is for educational and automation purposes. Always comply with Instagram's Terms of Service and API usage guidelines. Use responsibly and ethically.

**Account:** omar_saadaoui_officiel
**Created by:** 3amrouch
**Version:** 1.0.0
