const { rejects } = require("assert")
const Product = require("../models/ProductModel")


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
module.exports = {
    createProduct
}    

