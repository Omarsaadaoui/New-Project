import OpenAI from 'openai';
import dotenv from 'dotenv';
import { createLogger } from '../utils/logger.js';

dotenv.config();

const logger = createLogger('OpenAI');

class AIClient {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
  }

  async generateResponse(prompt, context = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const response = completion.choices[0].message.content.trim();
      logger.info('Generated AI response');
      
      return response;
    } catch (error) {
      logger.error('Failed to generate AI response:', error.message);
      throw error;
    }
  }

  buildSystemPrompt(context) {
    const personality = process.env.AI_PERSONALITY || 'friendly and professional';
    const language = process.env.AI_LANGUAGE || 'french';
    const style = process.env.AI_RESPONSE_STYLE || 'concise and engaging';
    
    return `You are an AI assistant managing the Instagram account "omar_saadaoui_officiel".

Your personality: ${personality}
Response language: ${language}
Response style: ${style}

Guidelines:
- Keep responses short and engaging (max 2-3 sentences)
- Use emojis appropriately but not excessively
- Be authentic and maintain the account's voice
- Show appreciation for positive comments
- Handle negative comments professionally
- Encourage engagement and conversation
- Never share personal information
- Stay on brand and relevant to the account's content

${context.userInfo ? `Account info: ${context.userInfo.biography}` : ''}
${context.recentPosts ? `Recent post topics: ${context.recentPosts}` : ''}`;
  }

  async generateCommentReply(comment, context = {}) {
    const prompt = `Generate a reply to this Instagram comment: "${comment}"
    
Keep it natural, friendly, and appropriate for the omar_saadaoui_officiel account.`;

    return await this.generateResponse(prompt, context);
  }

  async generateDMReply(message, context = {}) {
    const prompt = `Generate a reply to this Instagram direct message: "${message}"
    
Keep it helpful, professional, and personalized.`;

    return await this.generateResponse(prompt, context);
  }

  async generateCaption(topic, style = 'motivational') {
    const prompt = `Generate an engaging Instagram caption about "${topic}" in a ${style} style.
    
Include:
- A compelling hook
- 2-3 sentences of valuable content
- A call-to-action or question
- 3-5 relevant hashtags

Language: ${process.env.AI_LANGUAGE || 'french'}`;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a social media content creator specializing in Instagram captions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      logger.error('Failed to generate caption:', error.message);
      throw error;
    }
  }

  async analyzeEngagement(posts) {
    const prompt = `Analyze these Instagram posts and provide insights:

${posts.map((p, i) => `Post ${i + 1}: ${p.likeCount} likes, ${p.commentCount} comments
Caption: ${p.caption.substring(0, 100)}...`).join('\n\n')}

Provide:
1. Best performing content type
2. Optimal posting patterns
3. Engagement improvement suggestions
4. Content recommendations

Keep it concise and actionable.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a social media analytics expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      logger.error('Failed to analyze engagement:', error.message);
      throw error;
    }
  }

  async moderateContent(text) {
    try {
      const moderation = await this.client.moderations.create({
        input: text
      });

      const result = moderation.results[0];
      
      return {
        flagged: result.flagged,
        categories: result.categories,
        safe: !result.flagged
      };
    } catch (error) {
      logger.error('Failed to moderate content:', error.message);
      throw error;
    }
  }
}

export default new AIClient();
