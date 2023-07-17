import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  // aniList Id for an anime
  aniListId: {
    type: Number,
    required: [true, 'AniList ID is required'],
    unique: [true, 'AniList ID must be unique'],
  },
});

const Anime = mongoose.model('Anime', animeSchema);

export default Anime;
