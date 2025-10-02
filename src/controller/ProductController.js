const express = require("express")
const ProductService = require("../services/ProductService.js")


const create_product = async (req , res) => {
        try{    
                const {name ,image , type,countInStock ,price ,rating, description , discount} = req.body
                if (!name || !image || !type || !countInStock || !price || !rating || !description || !discount){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the input is required'
                    })
                }
                const response = await ProductService.createProduct(req.body)
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
             if(!productid){
                    return res.status(404).json({
                        status :'ERR',
                        message :'the product is not exist'
                    })
             }
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
             const response = await ProductService.delete_product(productid )   
             return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const delete_many_product = async (req , res) => {
        try{    
             const ids = req.body.id
             if(!ids){
                    return res.status(200).json({
                        status :'ERR',
                        message :'the product not exist'
                    })
             }
             const response = await ProductService.delete_many(ids)   
             return res.status(200).json(response)
        }catch(e) {
            return res.status(404).json({
                message: e
            })
        }
}
const getDetailsProduct = async (req, res) => {
    try {
        const productid = req.params.id;
        if (!productid) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Missing product id'
            });
        }
        const response = await ProductService.getDetailsProduct(productid);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};
const getAll = async (req, res) => {
    try {
        let { limit, page, sort, filter, value } = req.query;

        // 👉 Kiểm tra nếu limit là mảng → lấy phần tử cuối cùng (ví dụ: 6)
        if (typeof limit === 'string' && limit.includes(',')) {
            const parts = limit.split(',');
            limit = parts[parts.length - 1]; // Lấy phần tử cuối cùng
        }
        if (Array.isArray(page)) {
            page = page[page.length - 1];
        }
        const limitNum = parseInt(limit, 10) || 8;
        const pageNum = parseInt(page, 10) || 0;
        const response = await ProductService.getAllProduct(
            limitNum,
            pageNum,
            sort,
            filter,
            value
        );
        return res.status(200).json({
            status: 'OK',
            data: response
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERROR',
            message: e.message || 'Internal server error'
        });
    }
};
const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllTypes();
        return res.status(200).json({
            status: 'OK',
            data: response
        });
    } catch (e) {
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
    delete_many_product,
    getDetailsProduct,
    getAll,
    getAllType
}