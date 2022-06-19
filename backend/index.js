
import express from "express";
import bodyParser from "body-parser";
import usersRoutes from './routes/users.js'
import cors from 'cors'

const app = express()

const PORT =process.env.PORT||8080;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use('/users',usersRoutes)

app.listen(PORT,(req,res)=>{
    console.log(`start in http://localhost:${PORT}`)
})

// const enc = encrypt(message, password)
// console.log(enc);
// console.log(decrypt(enc, password).toString(CryptoJS.enc.Utf8));

// app.get('/',(req,res)=>{
//     res.send('Password Bank API')
// })


// app.get('',(req,res)=>{
//     res.render('index',{text:'ejs file'})
// })


// let obj = {
//     "name":"riski",
//     "alamat":"samping tower"
// }

// jsonRead('./user.json',(err,Data)=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log(Data)
//     }
// })

// jsonRead('./user.json',(err,Data)=>{
//     if(err){
//         console.log(err);
//     }else{
//         Data.push(obj);
//         fs.writeFile('./user.json',JSON.stringify(Data,null,2),err=>{
//             if(err){
//                 console.log(err)
//             }
//         })
//     }
// })


// const app = express()
// const PORT = 5000

// app.use(bodyParser.json())

// app.use('/users',userRoutes)

// app.get('/',(req,res)=>{
//     res.send('halo coba coba')
// })

// app.listen(PORT,()=>{console.log('halo server jalan')})