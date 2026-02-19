const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', favoriteController.toggleFavorite);
router.get('/', favoriteController.getFavorites);

module.exports = router;
