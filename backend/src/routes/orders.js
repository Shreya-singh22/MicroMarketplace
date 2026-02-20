const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', orderController.getOrders);

module.exports = router;
