import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import compressFilter from './utils/compressFilter.util';
import config from './config/config';
import payout from './routes/index';
const app: Express = express();

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: [config.cors_origin],
    credentials: true,
  })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/', payout);

export default app;
