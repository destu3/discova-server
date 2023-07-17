import express from 'express';
import {
  signUp,
  login,
  isLoggedIn,
  sendLoggedInUser,
} from './controllers/auth.js';
import { search, getAnimeInfo } from './controllers/anime.js';

const router = express.Router();

// api routes
router.post('/api/sign-up', signUp); // auth routes
router.post('/api/login', login);
router.get('/api/current-user', isLoggedIn, sendLoggedInUser);

router.get('/api/search', search);
router.get('/api/anime/:aniListId', getAnimeInfo);
export default router;
