const OrderService = require('../services/OrderService')
const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken , genneralRefreshToken } = require('./JwtService')


 const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullname, address, city, phone, user } = newOrder;
      const promises = orderItems.map(async (order) => {
        const checkOrder = await Product.findOneAndUpdate(
          { _id: order.product, countInStock: { $gte: order.amount } },
          { $inc: { countInStock: -order.amount, selled: +order.amount } },
          { new: true }
        );
        if (!checkOrder) {
          return { status: 'ERR', data: order.product };
        }
        return null;
      });
      const results = await Promise.all(promises);
      const newData = results.filter((item) => item && item.data);

      if (newData.length) {
        return resolve({
          status: 'ERR',
          message: `Sản phẩm với id ${newData.map(d => d.data).join(', ')} không đủ hàng`
        });
      }
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: { fullname, address, city, phone },
        paymentMethod,
        itemsPrice,
        shippingPrice,  
        totalPrice,
        user
      });
      if (!createdOrder) {
        return resolve({
          status: 'ERR',
          message: 'Không tạo được order'
        });
      }
      return resolve({
        status: 'OK',
        message: 'SUCCESS',
      });
    } catch (e) {
      return reject(e);
    }
  });
};

const getAllDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
          console.log("id user" , id)
            const order = await Order.find
            ({
               user: id 
              });
            if (order === null) {
                return resolve({
                    status: 'OK',
                    message: 'order is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById
            ({
               _id: id 
              });
            if (order === null) {
                return resolve({
                    status: 'OK',
                    message: 'order is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find();
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allOrder
                });
            }
         catch (e) {
            reject(e);
        }
    });
};
// const cancelOrderDetails = (id , data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//               const promises = data.orderItems.map(async (order) => {
//                 const productData = await Product.findOneAndUpdate(
//                   { _id: order.product, selled: { $gte: order.amount } },
//                   { $inc: { countInStock: +order.amount, selled: -order.amount } },
//                   { new: true }
//                 );
//               if (productData) {
//                 const order = await Order.findByIdAndDelete(id)
//                 if(order === null) {
//                     return resolve({
//                         status: 'ERR',
//                         message: 'the order is not defined',
//                     });
//                 }else {
//                     return resolve({
//                         status: 'OK',
//                         message: 'SUCCESS',
//                     });
//                 }
//                             }
//               const results = await Promise.all(promises);
//               const newData = results && results.filter((item)  => item);
//               if(newData.length) {
//                   return resolve({
//                       status: 'ERR',
//                       message: `Sản phẩm với id ${newData.join(', ')} không ton tai`
//                   });
//               }
//               resolve({
//                   status: 'OK',
//                   message: 'SUCCESS',
//                   data: order
//               });
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };
const cancelOrderDetails = async (id, data) => {
  try {
    // Cập nhật lại số lượng sản phẩm
    const promises = data.map(async (item) => {
      const productData = await Product.findOneAndUpdate(
        { _id: item.product, selled: { $gte: item.amount } },
        { $inc: { countInStock: +item.amount, selled: -item.amount } },
        { new: true }
      );
      if (!productData) {
        return item.product; // trả về id sản phẩm lỗi
      }
      return null;
    });
    const results = await Promise.all(promises);
    const failedProducts = results.filter((p) => p !== null);
    if (failedProducts.length > 0) {
      return {
        status: 'ERR',
        message: `Sản phẩm với id ${failedProducts.join(', ')} không tồn tại hoặc không đủ số lượng`,
      };
    }
    // Nếu sản phẩm ok thì xóa order
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return {
        status: 'ERR',
        message: 'The order is not defined',
      };
    }
    return {
      status: 'OK',
      message: 'SUCCESS',
      data: deletedOrder,
    };
  } catch (e) {
    return {
      status: 'ERR',
      message: e.message,
    };
  }
};

module.exports = {
    createOrder,
    getAllDetailsOrder,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder
}