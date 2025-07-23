const express = require("express")
const ProductService = require("../services/ProductService.js")


const create_product = async (req , res) => {
        try{    
                const {name ,image , type,countInStock ,price ,rating, description} = req.body
                console.log('req.body', req.body)
                if (!name || !image || !type || !countInStock || !price ||!rating || !description){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the input is required'
                    })
                }
                //console.log('isCheckemail' ,isCheckemail)
                const response = await ProductService.createProduct(req.body)
                console.log('response' , response)
                return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const update_product = async (req , res) => {
        try{    
             const productid = req.params.id
             const data = req.body
             console.log('data' ,data)
             if(!productid){
                    return res.status(404).json({
                        status :'ERR',
                        message :'the product is not exist'
                    })
             }
             console.log('ProductId',productid)
             const response = await ProductService.update_product(productid , data)   
             return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const delete_product = async (req , res) => {
        try{    
             const productid = req.params.id
             const token = req.headers
             if(!productid){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the product not exist'
                    })
             }
             console.log('Productid',productid)
             const response = await ProductService.delete_product(productid )   
             return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const getDetailsProduct = async (req , res) => {
    try{
        const productid = req.params.id
        if(!productid){
            return res.status(200).json({
                        status :'ERR',
                        message :'the password is equal confirmPassword'
                    }) 
        }
        console.log('productid' , productid)
        const response = await ProductService.getDetailsProduct(productid)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const getAll = async (req, res) => {
    try {
        const { limit , page ,sort , filter } = req.query; // Lấy limit và page từ query string
        const response = await ProductService.getAllProduct(Number(limit) || 8, Number(page) || 0 , filter);
        return res.status(200).json({
            status: 'OK',
            data: response
        });
    } catch (e) {
        console.error(e); // log lỗi cho backend theo dõi
        return res.status(500).json({
            status: 'ERROR',
            message: e.message || 'Internal server error'
        });
    }
};
module.exports = {
    create_product,
    update_product,
    delete_product,
    getDetailsProduct,
    getAll
}
