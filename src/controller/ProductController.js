const express = require("express")
const ProductService = require("../services/ProductService.js")


const create_product = async (req , res) => {
        try{    
                const {name ,image , type,countInStock ,price ,rating, description} = req.body
                console.log('req.body', req.body)
                if (!name || !image || !type || !countInStock || !price || !rating || !description){
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
const delete_many_product = async (req , res) => {
        try{    
             const ids = req.body.id
             console.log('ids' , ids) 
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
        console.log('productid:', productid);
        const response = await ProductService.getDetailsProduct(productid);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};

// const getAll = async (req, res) => {
//     try {
//         const { limit , page ,sort , filter } = req.query; // Lấy limit và page từ query string
//         const response = await ProductService.getAllProduct(Number(limit) || 8, Number(page) || 0 , filter);
//         return res.status(200).json({
//             status: 'OK',
//             data: response
//         });
//     } catch (e) {
//         console.error(e); // log lỗi cho backend theo dõi
//         return res.status(500).json({
//             status: 'ERROR',
//             message: e.message || 'Internal server error'
//         });
//     }
// };
const getAll = async (req, res) => {
    try {
        let { limit, page, sort, filter, value } = req.query;

        // 👉 Kiểm tra nếu limit là mảng → lấy phần tử cuối cùng (ví dụ: 6)
        if (typeof limit === 'string' && limit.includes(',')) {
            const parts = limit.split(',');
            limit = parts[parts.length - 1]; // Lấy phần tử cuối cùng
        }
        console.log('first' , limit)
        if (Array.isArray(page)) {
            page = page[page.length - 1];
        }

        const limitNum = parseInt(limit, 10) || 8;
        const pageNum = parseInt(page, 10) || 0;
        console.log('🔍 Filter:', filter);
        console.log('🔍 Value:', value);
        console.log('📦 limitNum:', limitNum, '| pageNum:', pageNum);
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
        console.error('❌ Error in getAll:', e);
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
    getAll
}