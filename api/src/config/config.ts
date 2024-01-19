
const config = {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '3000',
  cors_origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  db_url: process.env.DBURL || 'mongodb://127.0.0.1:27017/exprress-sample'
};
export default config;
