import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Reference to the parent anime document
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: [true, 'Anime id is required'],
  },
  // Reference to the parent user document
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User id is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title can not exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description can not exceed 500 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating can not exceed 10'],
  },
  spoiler: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
