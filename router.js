import express from 'express';
import {
  signUp,
  login,
  isAuthenticated,
  sendLoggedInUser,
} from './controllers/auth.js';
import { addToList, removeFromList } from './controllers/user.js';
import {
  search,
  getAnimeInfo,
  getThemes,
  getAnimeDetailsByIds,
  getPopularThisSeason,
  getTrending,
  getPopular,
  getUpcoming,
} from './controllers/anime.js';

const router = express.Router();

// auth routes
router.post('/sign-up', signUp);
router.post('/login', login);

// anime routes
router.get(/^\/anime\/search$/, search); // Use regular expression to match exact "search"
router.get('/anime/:aniListId(\\d+)', getAnimeInfo);
router.get('/anime/themes/:aniListId', getThemes);
router.get('/anime/details-by-ids', isAuthenticated, getAnimeDetailsByIds);
router.get('/anime/featured/popular-this-season', getPopularThisSeason);
router.get('/anime/featured/trending', getTrending);
router.get('/anime/featured/popular', getPopular);
router.get('/anime/featured/upcoming', getUpcoming);

// user routes
router.use(isAuthenticated);
router.get('/current-user', sendLoggedInUser);
router.route('/user/list/:animeId').patch(addToList).delete(removeFromList);

export default router;
