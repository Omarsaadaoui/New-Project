import instagramClient from './config/instagram.js';
import aiClient from './config/openai.js';
import { createLogger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('Main');

class InstagramAIHelper {
  async start() {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           INSTAGRAM AI HELPER                                 ║
║           Account: omar_saadaoui_officiel                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);

    try {
      // Test Instagram connection
      logger.info('Testing Instagram connection...');
      await instagramClient.login();
      const userInfo = await instagramClient.getUserInfo();
      
      console.log('\n✓ Instagram Connected');
      console.log(`  Username: @${userInfo.username}`);
      console.log(`  Followers: ${userInfo.followerCount.toLocaleString()}`);
      console.log(`  Posts: ${userInfo.mediaCount.toLocaleString()}`);

      // Test OpenAI connection
      logger.info('Testing OpenAI connection...');
      const testResponse = await aiClient.generateResponse('Say "AI Connected"', {});
      console.log('\n✓ OpenAI Connected');
      console.log(`  Model: ${aiClient.model}`);

      console.log('\n' + '='.repeat(65));
      console.log('AVAILABLE COMMANDS:');
      console.log('='.repeat(65));
      console.log('\n1. Auto-Reply Bot');
      console.log('   npm run auto-reply');
      console.log('   Automatically reply to comments and DMs using AI\n');

      console.log('2. Content Generator');
      console.log('   npm run generate-content single [topic] [style]');
      console.log('   npm run generate-content multiple [count]');
      console.log('   npm run generate-content weekly');
      console.log('   Generate AI-powered Instagram content\n');

      console.log('3. Post Scheduler');
      console.log('   npm run schedule-post start');
      console.log('   npm run schedule-post list');
      console.log('   Schedule and manage posts\n');

      console.log('4. Analytics');
      console.log('   npm run analytics report');
      console.log('   npm run analytics growth');
      console.log('   Track performance and insights\n');

      console.log('='.repeat(65));
      console.log('\nSetup complete! Your Instagram AI Helper is ready to use.');
      console.log('Check README.md for detailed instructions.\n');

    } catch (error) {
      logger.error('Setup failed:', error.message);
      console.log('\n❌ Setup Failed');
      console.log('\nPlease check:');
      console.log('1. Your .env file is configured correctly');
      console.log('2. Instagram credentials are valid');
      console.log('3. OpenAI API key is valid');
      console.log('4. You have internet connection\n');
      throw error;
    }
  }

  async testAIResponse() {
    try {
      console.log('\n--- Testing AI Response Generation ---\n');

      const testComment = "J'adore ton contenu! Continue comme ça 🔥";
      console.log(`Test Comment: "${testComment}"\n`);

      const response = await aiClient.generateCommentReply(testComment, {});
      console.log(`AI Reply: "${response}"\n`);

      console.log('✓ AI response generation working correctly\n');
    } catch (error) {
      logger.error('AI test failed:', error.message);
      throw error;
    }
  }
}

// Run the helper
const helper = new InstagramAIHelper();

const args = process.argv.slice(2);
const command = args[0];

(async () => {
  try {
    if (command === 'test') {
      await helper.testAIResponse();
    } else {
      await helper.start();
    }
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
})();
