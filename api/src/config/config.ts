import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const config = {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '3000',
  cors_origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
};

export default config;
