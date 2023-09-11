import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

const connString = process.env.DB_CONNECTION_STRING;
const port =
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_PORT
    : process.env.DEV_PORT;

// reads .env file and sets environment variables
// environment variables are just values that can be accessed by the node process
dotenv.config();

// connect to mongoDb server
mongoose.set('strictQuery', false);
mongoose
  .connect(connString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to remote database server');
    // start server
    app.listen(port, () => console.log('App listening for requests'));
  });
