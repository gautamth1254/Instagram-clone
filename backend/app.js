
const express = require('express');

const app = express();

const PORT = 5000;

const mongoose = require('mongoose');
const {mongoUrl} = require('./keys')
const cors = require('cors');
app.use(cors());


// ---------------------------------------------------------------- Mongodb connection

require('./Models/models')
require('./Models/post')
app.use(express.json());
app.use(require("./Routes/auth"))
app.use(require("./Routes/createPost"))
mongoose.connect(mongoUrl)

mongoose.connection.on("connected",()=>{
    console.log("successfully connected to mongo");
})

mongoose.connection.on("error",()=>{
    console.log("not successfully connected to mongo");
})

//-------------------------------------------------------------------------------------


app.listen(PORT,()=>{
    console.log("server is listening on " + PORT );

});


















// //module use krne k liye require krenge module ko

// const http = require('http');

// // abb hame server banana hai

// const server = http.createServer((req,res)=>{
//     console.log("server created");
//     res.end("working")
// })

// //server ko kisi port se chalane k liye

// server.listen(5000,"localhost",()=>{
//     console.log("server is listening on port 5000")
// })








// const data= require('./data')




// app.get('/', (req, res) => {
//     res.json({
//         "name": "Gaurav",
//         "email": "gaurav@gmail.com"
//         })
// })

// app.get('/about', (req, res) => {
//     res.json(data)
// })