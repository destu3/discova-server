import mongoose from 'mongoose';

const WatchProgressSchema = new mongoose.Schema({
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: [true, 'Anime field is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User field is required'],
  },
  currentEpisode: {
    type: Number,
    min: [0, 'Current episode cannot be less than 0'],
    default: 0,
    required: [true, 'Current episode field is required'],
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
  dateStarted: {
    type: Date,
    default: Date.now(),
    required: [true, 'Date started field is required'],
  },
  dateFinished: {
    type: Date,
  },
  rewatchCount: {
    type: Number,
    min: [0, 'Rewatch count cannot be less than 0'],
  },
  watchStatus: {
    enum: ['currently_watching', 'completed', 'plan_to_watch'],
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [10, 'Rating cannot be greater than 10'],
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
});

const WatchProgress = mongoose.model('WatchProgress', WatchProgressSchema);

export default WatchProgress;
