import { promisify } from 'util';
import jsonwebtoken from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/user.js';
import catchAsyncErr from '../utils/catch-async.js';
import OperationalError from '../classes/operational-error.js';

// reconfigure for this to work?????
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// generates a signed jwt
const signToken = id => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// sends a jwt to the client
const sendToken = (user, statusCode, res) => {
  // sign jwt
  const jwt = signToken(user._id);

  user.password = undefined;

  res
    .status(statusCode)
    .json({ message: `Welcome ${user.username}`, user, token: jwt });
};

// Create a new user account
export const signUp = catchAsyncErr(async (req, res, next) => {
  const { username, password, email, fullName, image } = req.body;

  if (!username || !password || !email || !fullName)
    throw new OperationalError(
      'Fields missing! Please enter all required fields',
      400
    );

  let pfpUrl;
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      public_id: `${username}_profile`,
      resource_type: 'auto',
      crop: 'fill',
      width: 500,
      height: 500,
      gravity: 'auto',
      quality: 100,
    });
    pfpUrl = result.secure_url;
  }

  // create and save document
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    profilePicture: pfpUrl,
  });

  // generate jwt and send to user
  sendToken(user, 201, res);
});

// log user in to their account
export const login = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body;

  // check fields have been entered
  if (!email || !password)
    throw new OperationalError(
      'Fields missing! Please enter email and password',
      400
    );

  // find user by username
  const user = await User.findOne({ email });

  // check if user exists and password is correct
  if (!user || !(await user.comparePassword(password)))
    throw new OperationalError(
      'Email or password is incorrect! Please try again',
      400
    );

  // generate jwt and send to user
  sendToken(user, 200, res);
});

// checks if a user is authenticated and
export const isAuthenticated = async (req, res, next) => {
  const verifyToken = promisify(jsonwebtoken.verify);

  try {
    let token;

    // user is logged in
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      return next(
        new OperationalError(
          'Unauthorized: Please authenticate to access.',
          401
        )
      );
    }

    // verify token
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    // check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new OperationalError('User not found: ' + decoded.id, 404));
    }

    user.password = undefined;

    // access user other middleware
    req.user = user;
  } catch (err) {
    return next();
  }

  next();
};

// sends the logged in users details
export const sendLoggedInUser = (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
};
