const express = require("express") ;
const dotenv = require('dotenv'); 
const routes = require('./routes')
const  mongoose  = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.json())
app.use(express.json()); // Đọc JSON body
app.use(cors()); // Sử dụng CORS để cho phép các yêu cầu từ các nguồn khác nhau
app.use(cookieParser()); // Để đọc cookies từ request
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'})); 
routes(app);
console.log('process.env.MONGO_DB' , process.env.MONGO_DB )

mongoose.connect(`${process.env.MONGO_DB}`)
.then(() => {
    console.log('Connect Db success!')
})
.catch((err) => {
    console.log(err)
})

// app.listen(port ,() => {
//         console.log('Server is running in port:', + port)
// })
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running in port: ${PORT}`);
});
