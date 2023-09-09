// imports
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import router from './router.js';
import globalErrorHandler from './global-handler.js';
import OperationalError from './classes/operational-error.js';

// path to current file
const __filename = fileURLToPath(import.meta.url);

// path to current directory
const __dirname = path.dirname(__filename);

const app = express();

// global middleware
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// middleware preventing parameter pollution - duplicate fields in queryString
app.use(hpp());

// mount router
app.use('/api', router);

// handle unhandled routes
app.all('*', async (req, res, next) => {
  const message = `Page does not yet exist`;
  next(new OperationalError(message, 404));
});

// global error handler
app.use(globalErrorHandler);

export default app;
