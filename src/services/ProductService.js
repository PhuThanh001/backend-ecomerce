const { rejects } = require("assert")
const Product = require("../models/ProductModel")
const { promises } = require("dns")
const { resolve } = require("path")


const createProduct = (NewProduct) => {
    return new Promise(async (resolve , rejects) => {
        try{
            const {name ,image,type ,countInStock, price,rating,description} = NewProduct
            
                const checkProduct = await Product.findOne({
                    name : name
                })
                if (checkProduct !== null){
                    resolve ({
                        status: 'OK',
                        message: 'the name of product is already'
                    })
                }
            const createProduct = await Product.create({
                name , image ,type ,countInStock ,price ,rating ,description
            })
            if(createProduct){
                resolve({
                    status : 'OK',
                    message : 'SUCCESS',
                    data: createProduct
                })
            }}
            catch(e){
            return res.status(404).json({
                message: e
            })
        }
    })}
const update_product = (id , data) => {
    return new Promise(async (resolve , rejects) => {
        try{
            
                const checkProduct = await Product.findOne({
                    _id: id
                })
                if (checkProduct === null){
                    resolve ({
                        status: 'OK',
                        message: 'the product is not defined'
                    })
                }
            const updateProduct = await Product.findByIdAndUpdate(id ,data ,{new: true})
                resolve({
                    status : 'OK',
                    message : 'SUCCESS',
                    data: updateProduct
                })
            }
            catch(e){
                rejects(e)
        }
    })}
    const delete_product = (id ) => {
    return new Promise(async (resolve , rejects) => {
        try{
            
                const checkProduct = await Product.findOne({
                    _id: id
                })
                if (checkProduct === null){
                    resolve ({
                        status: 'OK',
                        message: 'the product is not defined'
                    })
                }
            const deleteproduct = await Product.findByIdAndDelete(id , {new: true})
                resolve({
                    status : 'OK',
                    message : 'SUCCESS',
                    data: deleteproduct
                })
            }
            catch(e){
                rejects(e)
        }
    })}
const getDetailsProduct = (id) => {
    return new promises(async (resolve , rejects)=> {
        try {
            const checkproduct = await Product.findOne({
                _id: id
            })
            if (checkproduct === null){
                resolve({
                    status : 'OK' ,
                    message : 'Product is not define'
                })
            }
            resolve({
                status : 'OK' ,
                message : 'SUCCESS',
                data : checkproduct
            })
        }catch(e){
            rejects(e)
        }
    }
    )
}
const getAllProduct = () => {
    return new Promise(async (resolve , rejects)=> {
        try {
            const allProduct = await Product.find()
            resolve({
                status : 'OK' ,
                message : 'SUCCESS',
                data : allProduct
            })
        }catch(e){
            rejects(e)
        }
    }
    )
}
module.exports = {
    createProduct,
    update_product,
    delete_product,
    getAllProduct,
    getDetailsProduct
}    

