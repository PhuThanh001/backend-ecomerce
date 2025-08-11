const mongoose = require('mongoose');
const ProductSchema  = new mongoose.Schema(
    {
        name : {type : String ,require :true},
        image : {type : String },
        type : {type : String , require : true },
        price : {type : Number ,default :false},
        countInStock : {type : Number ,require :true} ,
        rating : {type :Number , require : true},
        description : {type : String ,require : true},
        discount: {type: Number},
        selled: {type: Number},
    },
    {
        timeseries : true
    }

);
const Product = mongoose.model("Product" ,ProductSchema);
module.exports = Product; 