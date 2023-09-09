import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'A name is required'],
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [6, 'Username must be at least 6 characters long'],
    maxlength: [20, 'Username cannot be more than 20 characters long'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  profilePicture: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: [true, 'Role is required'],
  },
  watchList: [
    {
      type: Number,
      default: [],
    },
  ],
  favourites: [
    {
      type: Number,
      default: [],
    },
  ],
});

// document middleware

// encrypt password before document is saved
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Instance methods

// compare provided password against encrypted password
userSchema.methods.comparePassword = async function (plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
