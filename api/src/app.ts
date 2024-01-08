import * as dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import connectDB from './dbConnection/db';

const app: Express = express();

// Load environment variables from .env file
dotenv.config();

// Enable CORS
app.use(cors({ origin: '*', credentials: true }));

// Set up rate limiter: limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
});
app.use(limiter);

// Set up Morgan for logging
app.use(morgan('dev'));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up views directory for EJS templates
app.set('views', path.join(__dirname, 'views'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Helmet is used to secure the app by configuring the http-header
app.use(helmet());

// Compression is used to reduce the size of the response body
app.use(compression());

// Connect to the database
connectDB();

// Define a simple route
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

// Include routes from the router
import router from './routes/index';
app.use('/', router);

export default app;
