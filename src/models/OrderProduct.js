const mongoose = require('mongoose');
const Product = require('./ProductModel');


const orderSchema  = new mongoose.Schema({
    
        orderItems: [
            {
        name : {type : String ,require :true},
        amount : {type : String , require :true , unique : true},
        image : {type : String , require : true },
        price : {type : Boolean ,default :false},
        Product : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
            require : true ,
        },

    },
],
        ShippingAddress: {
            fullname: {type: String , require : true },
            address: {type: String , require : true},
            city: {type : String , require : true},
            coutry: {type : String , require : true} ,
            phone: {type : String , require : true }
        },
        paymentMethod: {type: String , required :true},
        itemsPrice : {type: Number,required : true },
        ShippingAddress : {type: Number ,require : true},
        taxPrice : {type : Number, require : true  },
        totalPrice : {type: Number, require : true},
        user : {type: mongoose.Schema.Types.ObjectId, ref: 'User',required : true},
        isPaid : {type : Boolean ,default: false },
        paidAt : {type : Date},
        isDeliveredAt : {type : Boolean ,default : false},  
        deliveredAt : {type : Date},
},
        {
            timestamps: true,
        }
);
const Order = mongoose.model("order" ,orderSchema);
module.exports = order; 