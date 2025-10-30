import fs from 'fs/promises';
import path from 'path';
import { createLogger } from './logger.js';

const logger = createLogger('Database');
const DATA_DIR = './data';

class Database {
  constructor() {
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      logger.error('Failed to create data directory:', error.message);
    }
  }

  async save(collection, data) {
    try {
      const filePath = path.join(DATA_DIR, `${collection}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      logger.info(`Saved data to ${collection}`);
    } catch (error) {
      logger.error(`Failed to save ${collection}:`, error.message);
      throw error;
    }
  }

  async load(collection) {
    try {
      const filePath = path.join(DATA_DIR, `${collection}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      logger.error(`Failed to load ${collection}:`, error.message);
      throw error;
    }
  }

  async append(collection, item) {
    try {
      let data = await this.load(collection) || [];
      data.push({
        ...item,
        timestamp: new Date().toISOString()
      });
      await this.save(collection, data);
    } catch (error) {
      logger.error(`Failed to append to ${collection}:`, error.message);
      throw error;
    }
  }

  async getRecent(collection, limit = 10) {
    try {
      const data = await this.load(collection) || [];
      return data.slice(-limit).reverse();
    } catch (error) {
      logger.error(`Failed to get recent from ${collection}:`, error.message);
      throw error;
    }
  }

  async hasProcessed(collection, id) {
    try {
      const data = await this.load(collection) || [];
      return data.some(item => item.id === id);
    } catch (error) {
      logger.error(`Failed to check ${collection}:`, error.message);
      return false;
    }
  }
}

export default new Database();
