import { IgApiClient } from 'instagram-private-api';
import dotenv from 'dotenv';
import { createLogger } from '../utils/logger.js';

dotenv.config();

const logger = createLogger('Instagram');

class InstagramClient {
  constructor() {
    this.ig = new IgApiClient();
    this.ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);
    this.isLoggedIn = false;
  }

  async login() {
    try {
      logger.info(`Attempting to login as ${process.env.INSTAGRAM_USERNAME}...`);
      
      await this.ig.simulate.preLoginFlow();
      
      const auth = await this.ig.account.login(
        process.env.INSTAGRAM_USERNAME,
        process.env.INSTAGRAM_PASSWORD
      );
      
      await this.ig.simulate.postLoginFlow();
      
      this.isLoggedIn = true;
      logger.info('Successfully logged in to Instagram');
      
      return auth;
    } catch (error) {
      logger.error('Failed to login to Instagram:', error.message);
      throw error;
    }
  }

  async getRecentComments(limit = 20) {
    if (!this.isLoggedIn) {
      await this.login();
    }

    try {
      const userId = await this.ig.user.getIdByUsername(process.env.INSTAGRAM_USERNAME);
      const userFeed = this.ig.feed.user(userId);
      const posts = await userFeed.items();
      
      const comments = [];
      
      for (const post of posts.slice(0, 5)) {
        const commentsFeed = this.ig.feed.mediaComments(post.id);
        const postComments = await commentsFeed.items();
        
        for (const comment of postComments.slice(0, limit / 5)) {
          comments.push({
            id: comment.pk,
            text: comment.text,
            username: comment.user.username,
            userId: comment.user.pk,
            postId: post.id,
            timestamp: comment.created_at
          });
        }
      }
      
      return comments;
    } catch (error) {
      logger.error('Failed to fetch comments:', error.message);
      throw error;
    }
  }

  async replyToComment(commentId, text) {
    if (!this.isLoggedIn) {
      await this.login();
    }

    try {
      if (process.env.DRY_RUN_MODE === 'true') {
        logger.info(`[DRY RUN] Would reply to comment ${commentId}: "${text}"`);
        return { success: true, dryRun: true };
      }

      await this.ig.media.comment({
        mediaId: commentId,
        text: text
      });
      
      logger.info(`Replied to comment ${commentId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to reply to comment:', error.message);
      throw error;
    }
  }

  async getUserInfo() {
    if (!this.isLoggedIn) {
      await this.login();
    }

    try {
      const userId = await this.ig.user.getIdByUsername(process.env.INSTAGRAM_USERNAME);
      const userInfo = await this.ig.user.info(userId);
      
      return {
        username: userInfo.username,
        fullName: userInfo.full_name,
        biography: userInfo.biography,
        followerCount: userInfo.follower_count,
        followingCount: userInfo.following_count,
        mediaCount: userInfo.media_count
      };
    } catch (error) {
      logger.error('Failed to fetch user info:', error.message);
      throw error;
    }
  }

  async getRecentPosts(limit = 10) {
    if (!this.isLoggedIn) {
      await this.login();
    }

    try {
      const userId = await this.ig.user.getIdByUsername(process.env.INSTAGRAM_USERNAME);
      const userFeed = this.ig.feed.user(userId);
      const posts = await userFeed.items();
      
      return posts.slice(0, limit).map(post => ({
        id: post.id,
        caption: post.caption?.text || '',
        likeCount: post.like_count,
        commentCount: post.comment_count,
        timestamp: post.taken_at,
        mediaType: post.media_type
      }));
    } catch (error) {
      logger.error('Failed to fetch posts:', error.message);
      throw error;
    }
  }

  async getDirectMessages(limit = 20) {
    if (!this.isLoggedIn) {
      await this.login();
    }

    try {
      const inbox = this.ig.feed.directInbox();
      const threads = await inbox.items();
      
      const messages = [];
      
      for (const thread of threads.slice(0, limit)) {
        const threadFeed = this.ig.feed.directThread({ thread_id: thread.thread_id });
        const items = await threadFeed.items();
        
        for (const item of items.slice(0, 5)) {
          if (item.item_type === 'text') {
            messages.push({
              threadId: thread.thread_id,
              messageId: item.item_id,
              text: item.text,
              username: item.user_id,
              timestamp: item.timestamp
            });
          }
        }
      }
      
      return messages;
    } catch (error) {
      logger.error('Failed to fetch direct messages:', error.message);
      throw error;
    }
  }

  async sendDirectMessage(userId, text) {
    if (!this.isLoggedIn) {
      await this.login();
    }

    try {
      if (process.env.DRY_RUN_MODE === 'true') {
        logger.info(`[DRY RUN] Would send DM to ${userId}: "${text}"`);
        return { success: true, dryRun: true };
      }

      const thread = await this.ig.entity.directThread([userId.toString()]);
      await thread.broadcastText(text);
      
      logger.info(`Sent DM to user ${userId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to send direct message:', error.message);
      throw error;
    }
  }
}

export default new InstagramClient();
