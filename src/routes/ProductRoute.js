const express = require('express')
const router = express.Router()
const ProductController = require('../controller/ProductController.js')
const { authMiddleware } = require('../Middleware/authMiddleware.js')


router.post('/create', ProductController.create_product) 
router.put('/update/:id',authMiddleware , ProductController.update_product)
router.get('/getProductDetails/:id' , authMiddleware, ProductController.getDetailsProduct)
router.delete('/delete/:id' , ProductController.delete_product)
router.get('/getAll' , ProductController.getAll)

module.exports = router;
