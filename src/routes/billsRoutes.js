const express = require('express');
const router = express.Router();
const BillsController = require('../controllers/billscontroller');
const authMiddleware = require('../middlewares/auth');

router.post('/pay', authMiddleware.verifyToken, BillsController.pay);
router.get('/history', authMiddleware.verifyToken, BillsController.getBills);


module.exports = router;
