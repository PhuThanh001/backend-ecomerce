const express = require("express")
const OrderService = require("../services/OrderService.js")


const create_order = async (req , res) => {
        try{    
                const {paymentMethod, itemsPrice , shippingPrice , totalPrice, fullname , address , city ,phone} = req.body
                if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullname || !address || !city || !phone){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the input is required'
                    })
                }
                const response = await OrderService.createOrder(req.body)
                return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const getAllOrderDetails = async (req , res) => {
        try{    
                const userId = req.params.id
                if (!userId) {
                    return res.status(200).json({
                        status :'ERR',
                        message :'the userId is required'
                    })
                }
                const response = await OrderService.getAllDetailsOrder(userId)
                return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const getOrderDetails = async (req , res) => {
        try{    
                const orderId = req.params.id
                if (!orderId) {
                    return res.status(200).json({
                        status :'ERR',
                        message :'the userId is required'
                    })
                }
                const response = await OrderService.getDetailsOrder(orderId)
                return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const cancelOrderDetails = async (req , res) => {
        try{    
                const orderId = req.params.id
                const data = req.body
                if (!orderId) {
                    return res.status(200).json({
                        status :'ERR',
                        message :'the userId is required'
                    })
                }
                const response = await OrderService.cancelOrderDetails(orderId , data)
                return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const getAllOrder = async (req , res) => {
        try{    
                const data = await OrderService.getAllOrder()
                return res.status(200).json(data)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}

module.exports = {
    create_order,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
}