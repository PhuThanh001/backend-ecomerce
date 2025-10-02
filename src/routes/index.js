const UserRouter = require('../routes/UserRouter')
const ProductRouter = require('../routes/ProductRoute')
const OrderRouter = require('../routes/OrderRoute')
const paymentRouter = require('../routes/payment');


const routes = (app) => {
    app.use('/api/user' , UserRouter ) 
    app.use('/api/product' , ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use("/api/payment", paymentRouter);
}

module.exports = routes

