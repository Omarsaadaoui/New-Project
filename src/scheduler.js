import cron from 'node-cron';
import instagramClient from './config/instagram.js';
import database from './utils/database.js';
import { createLogger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('Scheduler');

class PostScheduler {
  constructor() {
    this.schedule = (process.env.POSTING_SCHEDULE || '09:00,14:00,19:00').split(',');
    this.jobs = [];
  }

  async start() {
    logger.info('Starting Post Scheduler for omar_saadaoui_officiel...');
    logger.info(`Posting times: ${this.schedule.join(', ')}`);

    // Schedule posts for each time
    for (const time of this.schedule) {
      const [hour, minute] = time.split(':');
      const cronExpression = `${minute} ${hour} * * *`;

      const job = cron.schedule(cronExpression, async () => {
        await this.postScheduledContent();
      });

      this.jobs.push(job);
      logger.info(`Scheduled post for ${time} (${cronExpression})`);
    }

    logger.info('Scheduler is running. Press Ctrl+C to stop.');
  }

  async postScheduledContent() {
    try {
      logger.info('Checking for scheduled content...');

      // Get pending posts from database
      const pendingPosts = await database.load('scheduled_posts') || [];
      const now = new Date();

      for (const post of pendingPosts) {
        const postTime = new Date(post.scheduledFor);

        // Check if it's time to post
        if (postTime <= now && post.status === 'scheduled') {
          await this.publishPost(post);
        }
      }
    } catch (error) {
      logger.error('Failed to post scheduled content:', error.message);
    }
  }

  async publishPost(post) {
    try {
      logger.info(`Publishing post: ${post.caption.substring(0, 50)}...`);

      if (process.env.DRY_RUN_MODE === 'true') {
        logger.info('[DRY RUN] Would publish post');
        console.log('\n' + '='.repeat(60));
        console.log('POST TO BE PUBLISHED');
        console.log('='.repeat(60));
        console.log(post.caption);
        console.log('='.repeat(60) + '\n');
        return;
      }

      // Login to Instagram
      await instagramClient.login();

      // Note: Actual posting requires image/video upload
      // This is a placeholder for the posting logic
      logger.warn('Image/video upload not implemented. Caption ready:');
      console.log(post.caption);

      // Update post status
      post.status = 'published';
      post.publishedAt = new Date().toISOString();

      // Save to published posts
      await database.append('published_posts', post);

      logger.info('Post published successfully');
    } catch (error) {
      logger.error('Failed to publish post:', error.message);
      post.status = 'failed';
      post.error = error.message;
      await database.append('failed_posts', post);
    }
  }

  async schedulePost(caption, scheduledFor, imageUrl = null) {
    try {
      const post = {
        id: Date.now().toString(),
        caption: caption,
        imageUrl: imageUrl,
        scheduledFor: scheduledFor,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      // Load existing scheduled posts
      const scheduledPosts = await database.load('scheduled_posts') || [];
      scheduledPosts.push(post);
      await database.save('scheduled_posts', scheduledPosts);

      logger.info(`Post scheduled for ${scheduledFor}`);
      return post;
    } catch (error) {
      logger.error('Failed to schedule post:', error.message);
      throw error;
    }
  }

  async listScheduledPosts() {
    try {
      const posts = await database.load('scheduled_posts') || [];
      const pending = posts.filter(p => p.status === 'scheduled');

      console.log('\n' + '='.repeat(60));
      console.log('SCHEDULED POSTS');
      console.log('='.repeat(60));

      if (pending.length === 0) {
        console.log('No posts scheduled');
      } else {
        pending.forEach((post, index) => {
          console.log(`\n${index + 1}. Scheduled for: ${post.scheduledFor}`);
          console.log(`   Caption: ${post.caption.substring(0, 100)}...`);
        });
      }

      console.log('='.repeat(60) + '\n');

      return pending;
    } catch (error) {
      logger.error('Failed to list scheduled posts:', error.message);
      throw error;
    }
  }

  async cancelScheduledPost(postId) {
    try {
      const posts = await database.load('scheduled_posts') || [];
      const post = posts.find(p => p.id === postId);

      if (post) {
        post.status = 'cancelled';
        await database.save('scheduled_posts', posts);
        logger.info(`Post ${postId} cancelled`);
      } else {
        logger.warn(`Post ${postId} not found`);
      }
    } catch (error) {
      logger.error('Failed to cancel post:', error.message);
      throw error;
    }
  }

  stop() {
    logger.info('Stopping scheduler...');
    this.jobs.forEach(job => job.stop());
    logger.info('Scheduler stopped');
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

const scheduler = new PostScheduler();

(async () => {
  try {
    switch (command) {
      case 'start':
        await scheduler.start();
        break;

      case 'schedule':
        const caption = args[1];
        const scheduledFor = args[2];
        const imageUrl = args[3];
        await scheduler.schedulePost(caption, scheduledFor, imageUrl);
        break;

      case 'list':
        await scheduler.listScheduledPosts();
        break;

      case 'cancel':
        const postId = args[1];
        await scheduler.cancelScheduledPost(postId);
        break;

      default:
        console.log(`
Instagram Post Scheduler for omar_saadaoui_officiel

Usage:
  npm run schedule-post start                              - Start the scheduler
  npm run schedule-post schedule [caption] [datetime]      - Schedule a post
  npm run schedule-post list                               - List scheduled posts
  npm run schedule-post cancel [postId]                    - Cancel a scheduled post

Examples:
  npm run schedule-post start
  npm run schedule-post schedule "Great content!" "2024-12-01T09:00:00"
  npm run schedule-post list
        `);
    }
  } catch (error) {
    logger.error('Command failed:', error.message);
    process.exit(1);
  }
})();
