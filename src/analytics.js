import instagramClient from './config/instagram.js';
import aiClient from './config/openai.js';
import database from './utils/database.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('Analytics');

class AnalyticsEngine {
  async generateReport() {
    try {
      logger.info('Generating analytics report for omar_saadaoui_officiel...');

      // Login to Instagram
      await instagramClient.login();

      // Gather data
      const userInfo = await instagramClient.getUserInfo();
      const recentPosts = await instagramClient.getRecentPosts(20);
      const processedComments = await database.load('processed_comments') || [];
      const processedDMs = await database.load('processed_dms') || [];

      // Calculate metrics
      const metrics = this.calculateMetrics(userInfo, recentPosts, processedComments, processedDMs);

      // Generate AI insights
      const insights = await aiClient.analyzeEngagement(recentPosts);

      // Create report
      const report = {
        generatedAt: new Date().toISOString(),
        account: userInfo,
        metrics: metrics,
        insights: insights,
        topPosts: this.getTopPosts(recentPosts, 5),
        recentActivity: {
          commentsReplied: processedComments.length,
          dmsReplied: processedDMs.length
        }
      };

      // Save report
      await database.append('analytics_reports', report);

      // Display report
      this.displayReport(report);

      return report;
    } catch (error) {
      logger.error('Failed to generate analytics report:', error.message);
      throw error;
    }
  }

  calculateMetrics(userInfo, posts, comments, dms) {
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.commentCount, 0);
    const avgLikes = posts.length > 0 ? Math.round(totalLikes / posts.length) : 0;
    const avgComments = posts.length > 0 ? Math.round(totalComments / posts.length) : 0;

    const engagementRate = userInfo.followerCount > 0
      ? ((totalLikes + totalComments) / (posts.length * userInfo.followerCount) * 100).toFixed(2)
      : 0;

    return {
      followers: userInfo.followerCount,
      following: userInfo.followingCount,
      totalPosts: userInfo.mediaCount,
      recentPosts: posts.length,
      totalLikes: totalLikes,
      totalComments: totalComments,
      avgLikesPerPost: avgLikes,
      avgCommentsPerPost: avgComments,
      engagementRate: `${engagementRate}%`,
      aiReplies: {
        comments: comments.length,
        dms: dms.length,
        total: comments.length + dms.length
      }
    };
  }

  getTopPosts(posts, limit = 5) {
    return posts
      .sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
      .slice(0, limit)
      .map(post => ({
        caption: post.caption.substring(0, 100) + '...',
        likes: post.likeCount,
        comments: post.commentCount,
        engagement: post.likeCount + post.commentCount
      }));
  }

  displayReport(report) {
    console.log('\n' + '='.repeat(80));
    console.log('INSTAGRAM ANALYTICS REPORT - omar_saadaoui_officiel');
    console.log('='.repeat(80));
    console.log(`Generated: ${new Date(report.generatedAt).toLocaleString()}`);
    console.log('\n--- ACCOUNT OVERVIEW ---');
    console.log(`Username: @${report.account.username}`);
    console.log(`Full Name: ${report.account.fullName}`);
    console.log(`Bio: ${report.account.biography}`);
    console.log(`Followers: ${report.metrics.followers.toLocaleString()}`);
    console.log(`Following: ${report.metrics.following.toLocaleString()}`);
    console.log(`Total Posts: ${report.metrics.totalPosts.toLocaleString()}`);

    console.log('\n--- ENGAGEMENT METRICS ---');
    console.log(`Engagement Rate: ${report.metrics.engagementRate}`);
    console.log(`Average Likes per Post: ${report.metrics.avgLikesPerPost.toLocaleString()}`);
    console.log(`Average Comments per Post: ${report.metrics.avgCommentsPerPost.toLocaleString()}`);
    console.log(`Total Likes (last ${report.metrics.recentPosts} posts): ${report.metrics.totalLikes.toLocaleString()}`);
    console.log(`Total Comments (last ${report.metrics.recentPosts} posts): ${report.metrics.totalComments.toLocaleString()}`);

    console.log('\n--- AI ASSISTANT ACTIVITY ---');
    console.log(`Comments Replied: ${report.metrics.aiReplies.comments}`);
    console.log(`DMs Replied: ${report.metrics.aiReplies.dms}`);
    console.log(`Total AI Interactions: ${report.metrics.aiReplies.total}`);

    console.log('\n--- TOP PERFORMING POSTS ---');
    report.topPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.caption}`);
      console.log(`   Likes: ${post.likes.toLocaleString()} | Comments: ${post.comments.toLocaleString()} | Total Engagement: ${post.engagement.toLocaleString()}`);
    });

    console.log('\n--- AI INSIGHTS ---');
    console.log(report.insights);

    console.log('\n' + '='.repeat(80) + '\n');
  }

  async trackGrowth() {
    try {
      logger.info('Tracking account growth...');

      await instagramClient.login();
      const userInfo = await instagramClient.getUserInfo();

      const growthData = {
        date: new Date().toISOString().split('T')[0],
        followers: userInfo.followerCount,
        following: userInfo.followingCount,
        posts: userInfo.mediaCount
      };

      await database.append('growth_tracking', growthData);

      // Get historical data
      const history = await database.load('growth_tracking') || [];
      
      if (history.length > 1) {
        const previous = history[history.length - 2];
        const followerGrowth = growthData.followers - previous.followers;
        const growthRate = ((followerGrowth / previous.followers) * 100).toFixed(2);

        console.log('\n--- GROWTH TRACKING ---');
        console.log(`Current Followers: ${growthData.followers.toLocaleString()}`);
        console.log(`Previous Followers: ${previous.followers.toLocaleString()}`);
        console.log(`Growth: ${followerGrowth > 0 ? '+' : ''}${followerGrowth} (${growthRate}%)`);
        console.log(`Tracking since: ${history[0].date}\n`);
      }

      logger.info('Growth data tracked');
    } catch (error) {
      logger.error('Failed to track growth:', error.message);
      throw error;
    }
  }

  async compareTimeframes(days = 7) {
    try {
      logger.info(`Comparing performance over last ${days} days...`);

      const history = await database.load('growth_tracking') || [];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentData = history.filter(entry => new Date(entry.date) >= cutoffDate);

      if (recentData.length < 2) {
        console.log('Not enough historical data for comparison');
        return;
      }

      const oldest = recentData[0];
      const newest = recentData[recentData.length - 1];

      const followerChange = newest.followers - oldest.followers;
      const postChange = newest.posts - oldest.posts;

      console.log('\n--- TIMEFRAME COMPARISON ---');
      console.log(`Period: ${oldest.date} to ${newest.date} (${days} days)`);
      console.log(`Follower Change: ${followerChange > 0 ? '+' : ''}${followerChange}`);
      console.log(`New Posts: ${postChange}`);
      console.log(`Avg Followers per Day: ${(followerChange / days).toFixed(1)}`);
      console.log(`Avg Posts per Day: ${(postChange / days).toFixed(1)}\n`);
    } catch (error) {
      logger.error('Failed to compare timeframes:', error.message);
      throw error;
    }
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

const analytics = new AnalyticsEngine();

(async () => {
  try {
    switch (command) {
      case 'report':
        await analytics.generateReport();
        break;

      case 'growth':
        await analytics.trackGrowth();
        break;

      case 'compare':
        const days = parseInt(args[1]) || 7;
        await analytics.compareTimeframes(days);
        break;

      default:
        console.log(`
Instagram Analytics for omar_saadaoui_officiel

Usage:
  npm run analytics report              - Generate full analytics report
  npm run analytics growth               - Track account growth
  npm run analytics compare [days]       - Compare performance over time

Examples:
  npm run analytics report
  npm run analytics growth
  npm run analytics compare 30
        `);
    }
  } catch (error) {
    logger.error('Command failed:', error.message);
    process.exit(1);
  }
})();
