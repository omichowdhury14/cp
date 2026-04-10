import pg from 'pg';
import config from './environment.js';
import logger from '../utils/logger.js';

const { Pool } = pg;

const pool = new Pool(config.database);

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  logger.info('New database connection established');
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Database connection failed:', err.message);
    process.exit(1);
  } else {
    logger.info('✓ Database connected successfully');
  }
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Executed query in ${duration}ms`);
    return result;
  } catch (error) {
    logger.error('Database query error:', error.message);
    throw error;
  }
};

export const getClient = async () => {
  return pool.connect();
};

export default pool;