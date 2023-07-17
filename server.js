import mongoose from 'mongoose';
import dotenv from 'dotenv';

// reads .env file and sets environment variables
// environment variables are just values that can be accessed by the node process
dotenv.config();

import app from './app.js';

const connString = process.env.DB_CONNECTION_STRING;

mongoose.set('strictQuery', false);
mongoose
  .connect(connString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to remote database server'));

// start server
const port = process.env.DEV_PORT;
app.listen(port, () =>
  console.log('App listening on port 8000! http://127.0.0.1:8000/')
);
