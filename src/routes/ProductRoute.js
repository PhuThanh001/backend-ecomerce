const express = require('express')
const router = express.Router()
const ProductController = require('../controller/ProductController.js')


router.post('/create', ProductController.create_product) 
router.post('/update' , ProductController.update_product)

module.exports = router;
