import aiClient from './config/openai.js';
import database from './utils/database.js';
import { createLogger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('ContentGenerator');

class ContentGenerator {
  constructor() {
    this.topics = (process.env.CONTENT_TOPICS || 'lifestyle,motivation,business').split(',');
  }

  async generatePost(topic = null, style = 'motivational') {
    try {
      const selectedTopic = topic || this.getRandomTopic();
      
      logger.info(`Generating content for topic: ${selectedTopic} (${style} style)`);

      const caption = await aiClient.generateCaption(selectedTopic, style);
      
      const post = {
        topic: selectedTopic,
        style: style,
        caption: caption,
        generatedAt: new Date().toISOString(),
        status: 'draft'
      };

      // Save to database
      await database.append('generated_content', post);
      
      logger.info('Content generated successfully');
      console.log('\n' + '='.repeat(60));
      console.log('GENERATED POST');
      console.log('='.repeat(60));
      console.log(`Topic: ${selectedTopic}`);
      console.log(`Style: ${style}`);
      console.log('\nCaption:');
      console.log(caption);
      console.log('='.repeat(60) + '\n');

      return post;
    } catch (error) {
      logger.error('Failed to generate content:', error.message);
      throw error;
    }
  }

  async generateMultiplePosts(count = 5) {
    logger.info(`Generating ${count} posts...`);
    
    const posts = [];
    const styles = ['motivational', 'educational', 'inspirational', 'storytelling', 'conversational'];

    for (let i = 0; i < count; i++) {
      const style = styles[i % styles.length];
      const post = await this.generatePost(null, style);
      posts.push(post);
      
      // Wait between generations
      await this.sleep(2000);
    }

    logger.info(`Generated ${posts.length} posts`);
    return posts;
  }

  async generateWeeklyContent() {
    logger.info('Generating weekly content plan...');

    const weekPlan = {
      monday: await this.generatePost('motivation', 'motivational'),
      tuesday: await this.generatePost('business', 'educational'),
      wednesday: await this.generatePost('personal_growth', 'inspirational'),
      thursday: await this.generatePost('lifestyle', 'conversational'),
      friday: await this.generatePost('success', 'motivational'),
      saturday: await this.generatePost('weekend', 'casual'),
      sunday: await this.generatePost('reflection', 'thoughtful')
    };

    await database.save('weekly_plan', {
      week: this.getWeekNumber(),
      plan: weekPlan,
      createdAt: new Date().toISOString()
    });

    logger.info('Weekly content plan created');
    return weekPlan;
  }

  async generateHashtags(caption, count = 10) {
    try {
      const prompt = `Based on this Instagram caption, generate ${count} relevant and trending hashtags:

"${caption}"

Return only the hashtags, separated by spaces, without numbering.`;

      const response = await aiClient.generateResponse(prompt, {});
      const hashtags = response.split(/\s+/).filter(tag => tag.startsWith('#'));
      
      return hashtags.slice(0, count);
    } catch (error) {
      logger.error('Failed to generate hashtags:', error.message);
      return [];
    }
  }

  async improveCaption(originalCaption) {
    try {
      const prompt = `Improve this Instagram caption to make it more engaging and effective:

"${originalCaption}"

Keep the core message but enhance:
- Hook/opening line
- Emotional connection
- Call-to-action
- Readability

Language: ${process.env.AI_LANGUAGE || 'french'}`;

      const improved = await aiClient.generateResponse(prompt, {});
      
      logger.info('Caption improved');
      return improved;
    } catch (error) {
      logger.error('Failed to improve caption:', error.message);
      throw error;
    }
  }

  getRandomTopic() {
    return this.topics[Math.floor(Math.random() * this.topics.length)];
  }

  getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

const generator = new ContentGenerator();

(async () => {
  try {
    switch (command) {
      case 'single':
        const topic = args[1];
        const style = args[2] || 'motivational';
        await generator.generatePost(topic, style);
        break;

      case 'multiple':
        const count = parseInt(args[1]) || 5;
        await generator.generateMultiplePosts(count);
        break;

      case 'weekly':
        await generator.generateWeeklyContent();
        break;

      case 'hashtags':
        const caption = args.slice(1).join(' ');
        const hashtags = await generator.generateHashtags(caption);
        console.log('\nGenerated Hashtags:');
        console.log(hashtags.join(' '));
        break;

      case 'improve':
        const original = args.slice(1).join(' ');
        const improved = await generator.improveCaption(original);
        console.log('\nImproved Caption:');
        console.log(improved);
        break;

      default:
        console.log(`
Instagram AI Content Generator for omar_saadaoui_officiel

Usage:
  npm run generate-content single [topic] [style]    - Generate a single post
  npm run generate-content multiple [count]          - Generate multiple posts
  npm run generate-content weekly                    - Generate weekly content plan
  npm run generate-content hashtags [caption]        - Generate hashtags for caption
  npm run generate-content improve [caption]         - Improve existing caption

Examples:
  npm run generate-content single motivation inspirational
  npm run generate-content multiple 5
  npm run generate-content weekly
  npm run generate-content hashtags "Your caption here"
        `);
    }
  } catch (error) {
    logger.error('Command failed:', error.message);
    process.exit(1);
  }
})();
