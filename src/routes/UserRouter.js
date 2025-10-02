const express = require("express")
const router = express.Router()
const userController = require('../controller/UserController')
const {authMiddleware , authUserMiddleWare } = require('../Middleware/authMiddleware')

router.post('/sign-up' , userController.createUser) 
router.post('/sign-in' , userController.loginUser) 
router.put('/update-user/:id' ,  userController.update_user)
router.delete('/delete-user/:id' ,authMiddleware ,  userController.delete_user)
router.get('/getAll' , userController.getAllUser)
router.get('/get-details/:id'  , userController.getDetailsUser)
router.post('/refresh-token' , userController.refreshToken)
router.post('/log-out', userController.logoutUser);
router.post('/delete-many' , authMiddleware , userController.delete_many) 

module.exports = router; 
