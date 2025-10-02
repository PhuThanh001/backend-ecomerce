const express = require('express')
const router = express.Router()
const OrderController = require('../controller/OrderController.js')
const { authMiddleware } = require('../Middleware/authMiddleware.js')


router.post('/create', OrderController.create_order) 
router.get('/get-all-order/:id', OrderController.getAllOrderDetails) 
router.get('/get-details-order/:id', OrderController.getOrderDetails) 
router.delete('/cancel-order/:id', OrderController.cancelOrderDetails) 
router.get('/get-all-order', OrderController.getAllOrder) 

module.exports = router;