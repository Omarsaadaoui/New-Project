import instagramClient from './config/instagram.js';
import aiClient from './config/openai.js';
import database from './utils/database.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('AutoReply');

class AutoReplyBot {
  constructor() {
    this.maxRepliesPerHour = parseInt(process.env.MAX_REPLIES_PER_HOUR) || 10;
    this.repliesThisHour = 0;
    this.lastResetTime = Date.now();
  }

  async start() {
    logger.info('Starting Auto-Reply Bot for omar_saadaoui_officiel...');

    try {
      // Login to Instagram
      await instagramClient.login();

      // Get account context
      const userInfo = await instagramClient.getUserInfo();
      logger.info(`Logged in as: ${userInfo.username} (${userInfo.followerCount} followers)`);

      // Process comments
      await this.processComments(userInfo);

      // Process direct messages
      await this.processDMs(userInfo);

      logger.info('Auto-reply cycle completed');
    } catch (error) {
      logger.error('Auto-reply bot error:', error.message);
      throw error;
    }
  }

  async processComments(userInfo) {
    try {
      logger.info('Fetching recent comments...');
      const comments = await instagramClient.getRecentComments(20);
      logger.info(`Found ${comments.length} comments`);

      for (const comment of comments) {
        // Check if we've already processed this comment
        if (await database.hasProcessed('processed_comments', comment.id)) {
          continue;
        }

        // Check rate limit
        if (!this.checkRateLimit()) {
          logger.warn('Rate limit reached, stopping comment processing');
          break;
        }

        // Skip if comment is from the account itself
        if (comment.username === process.env.INSTAGRAM_USERNAME) {
          continue;
        }

        logger.info(`Processing comment from @${comment.username}: "${comment.text}"`);

        // Moderate content
        const moderation = await aiClient.moderateContent(comment.text);
        if (!moderation.safe) {
          logger.warn(`Skipping inappropriate comment from @${comment.username}`);
          await database.append('flagged_comments', {
            id: comment.id,
            username: comment.username,
            text: comment.text,
            reason: 'content_moderation'
          });
          continue;
        }

        // Generate AI reply
        const context = {
          userInfo: userInfo,
          commentUsername: comment.username
        };

        const reply = await aiClient.generateCommentReply(comment.text, context);
        logger.info(`Generated reply: "${reply}"`);

        // Send reply
        await instagramClient.replyToComment(comment.id, reply);

        // Track processed comment
        await database.append('processed_comments', {
          id: comment.id,
          username: comment.username,
          originalComment: comment.text,
          reply: reply
        });

        this.repliesThisHour++;

        // Wait between replies to avoid rate limiting
        await this.sleep(5000);
      }
    } catch (error) {
      logger.error('Failed to process comments:', error.message);
    }
  }

  async processDMs(userInfo) {
    try {
      logger.info('Fetching recent direct messages...');
      const messages = await instagramClient.getDirectMessages(20);
      logger.info(`Found ${messages.length} messages`);

      for (const message of messages) {
        // Check if we've already processed this message
        if (await database.hasProcessed('processed_dms', message.messageId)) {
          continue;
        }

        // Check rate limit
        if (!this.checkRateLimit()) {
          logger.warn('Rate limit reached, stopping DM processing');
          break;
        }

        logger.info(`Processing DM: "${message.text}"`);

        // Moderate content
        const moderation = await aiClient.moderateContent(message.text);
        if (!moderation.safe) {
          logger.warn('Skipping inappropriate DM');
          await database.append('flagged_dms', {
            id: message.messageId,
            text: message.text,
            reason: 'content_moderation'
          });
          continue;
        }

        // Generate AI reply
        const context = {
          userInfo: userInfo
        };

        const reply = await aiClient.generateDMReply(message.text, context);
        logger.info(`Generated DM reply: "${reply}"`);

        // Send reply
        await instagramClient.sendDirectMessage(message.username, reply);

        // Track processed message
        await database.append('processed_dms', {
          id: message.messageId,
          originalMessage: message.text,
          reply: reply
        });

        this.repliesThisHour++;

        // Wait between replies
        await this.sleep(5000);
      }
    } catch (error) {
      logger.error('Failed to process DMs:', error.message);
    }
  }

  checkRateLimit() {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;

    // Reset counter if an hour has passed
    if (now - this.lastResetTime > hourInMs) {
      this.repliesThisHour = 0;
      this.lastResetTime = now;
    }

    return this.repliesThisHour < this.maxRepliesPerHour;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the bot
const bot = new AutoReplyBot();
bot.start().catch(error => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
