import mongoose from 'mongoose';
import dotenv from 'dotenv';

// reads .env file and sets environment variables
// environment variables are just values that can be accessed by the node process
dotenv.config();

import app from './app.js';

const connString = process.env.DB_CONNECTION_STRING;

// connect to mongoDb server
mongoose.set('strictQuery', false);
mongoose
  .connect(connString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to remote database server'));

const port = process.env.DEV_PORT;
// start server
app.listen(port, () =>
  console.log('App listening on port 8000! http://127.0.0.1:8000/')
);
