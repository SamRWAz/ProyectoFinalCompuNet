const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const BillController = require('../controllers/billsController');

router.post('/create', authenticateToken, BillController.createBill);
router.get('/', authenticateToken, BillController.getBills);

module.exports = router;