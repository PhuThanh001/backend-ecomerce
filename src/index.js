const express = require("express") ;
const dotenv = require('dotenv'); 
const routes = require('./routes')
const  mongoose  = require("mongoose");
const bodyParser = require("body-parser");
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.json())
app.use(express.json()); // Đọc JSON body

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
