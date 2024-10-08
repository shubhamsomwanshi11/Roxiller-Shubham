const express = require('express');
const productController = require('../controllers/productsController');
const router = express.Router();

router.get('/transactions',productController.listTransactions)
router.get('/statistics', productController.getStatistics);
router.get('/bar-chart', productController.getBarChart);
router.get('/pie-chart', productController.getPieChart);
router.get('/all', productController.getCombinedData);

module.exports = router;
