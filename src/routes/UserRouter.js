const express = require("express")
const router = express.Router()
const userController = require('../controller/UserController')
const {authMiddleware , authUserMiddleWare } = require('../Middleware/authMiddleware')
 

router.post('/sign-up' , userController.createUser) 
router.post('/sign-in' , userController.loginUser) 
router.put('/update-user/:id' , userController.update_user)
router.delete('/delete-user/:id' ,authMiddleware ,  userController.delete_user)
router.get('/getAll' ,authMiddleware, userController.getAllUser)
router.get('/get-details/:id' , authUserMiddleWare , userController.getDetailsUser)
router.get('/refresh-token' , userController.refreshToken)

module.exports = router; 