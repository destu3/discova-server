import express from 'express';
import {
  signUp,
  login,
  isLoggedIn,
  sendLoggedInUser,
} from './controllers/auth.js';
import { search, getAnimeInfo, getThemes } from './controllers/anime.js';

const router = express.Router();

// api routes
// auth routes
router.post('/api/sign-up', signUp);
router.post('/api/login', login);
router.get('/api/current-user', isLoggedIn, sendLoggedInUser);

// anime routes
router.get(/^\/api\/anime\/search$/, search); // Use regular expression to match exact "search"
router.get('/api/anime/:aniListId', getAnimeInfo);
router.get('/api/anime/themes/:aniListId', getThemes);

export default router;
