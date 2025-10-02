const { rejects } = require("assert")
const Product = require("../models/ProductModel")
const { promises } = require("dns")
const { resolve } = require("path")
const { console } = require("inspector")
const { all } = require("../routes/UserRouter")


const createProduct = (NewProduct) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const { name, image, type, countInStock, price, rating, description ,discount } = NewProduct

            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'the name of product is already'
                })
            }
            const createProduct = await Product.create({
                name, 
                image, 
                type, 
                countInStock: Number(countInStock), 
                price, 
                rating,
                description ,
                discount: Number(discount)
            })
            if (createProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createProduct
                })
            }
        }
        catch (e) {
            rejects(e)
        }
    })
}
const update_product = (id, data) => {
    return new Promise(async (resolve, rejects) => {
        try {

            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'the product is not defined'
                })
            }
            const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateProduct
            })
        }
        catch (e) {
            rejects(e)
        }
    })
}
const delete_product = (id) => {
    return new Promise(async (resolve, rejects) => {
        try {

            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'the product is not defined'
                })
            }
            const deleteproduct = await Product.findByIdAndDelete(id, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: deleteproduct
            })
        }
        catch (e) {
            rejects(e)
        }
    })
}
const delete_many = (ids) => {
    return new Promise(async (resolve, rejects) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
            })
        }
        catch (e) {
            rejects(e)
        }
    })
}
const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkproduct = await Product.findOne({ _id: id });
            if (checkproduct === null) {
                return resolve({
                    status: 'OK',
                    message: 'Product is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: checkproduct
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllProduct = (limit, page, sort, filterField, filterValue) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();


            // ✅ FILTER LOGIC
            if (filterField && filterValue) {
                const query = {
                    [filterField]: new RegExp(`^${filterValue}$`, 'i')  // <== chính xác hơn
                };
                const allObjectFilter = await Product.find(query)
                    .limit(limit)
                    .skip(page * limit);

                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectFilter,
                    total: totalProduct,
                    pagecurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                });
                return;
            }

            // ✅ SORT LOGIC
            if (sort) {
                const [sortField, sortOrder] = sort.split(','); // Ví dụ: "price,desc"
                const objectSort = {};
                objectSort[sortField] = sortOrder === 'desc' ? -1 : 1;

                const allProductSort = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort);

                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allProductSort,
                    total: totalProduct,
                    pagecurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                });
                return;
            }
            if(!limit){
                const allProduct = await Product.find();
                resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProduct,
                total: totalProduct,
                pagecurrent: page + 1,
                totalPage: Math.ceil(totalProduct / limit)
            });
            }else {
                const allProduct = await Product.find().limit(limit).skip(page * limit);
                resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProduct,
                total: totalProduct,
                pagecurrent: page + 1,
                totalPage: Math.ceil(totalProduct / limit)
            });
            }
        } catch (e) {
            reject(e);
        }
    });
};
const getAllTypes = () => {
    return new Promise(async (resolve, reject) => {
        try {
                const allObjectFilter = await Product.distinct('type')
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectFilter,
                });
        } catch (e) {
            console.error('❌ Lỗi trong getAllProduct:', e);
            reject(e);
        }
    });
};


module.exports = {
    createProduct,
    update_product,
    delete_product,
    delete_many,
    getAllProduct,
    getDetailsProduct,
    getAllTypes
}

