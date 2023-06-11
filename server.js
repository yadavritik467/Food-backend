import  express  from "express"
import  router  from "./routes/userRoutes.js"
import  carousel  from "./routes/carousel.js"
import  FoodRouter  from "./routes/Foods.js"
import  orderRouter  from "./routes/order.js"
import  paymentRouter  from "./routes/payment.js"
import  mongoDB  from "./controller/db.js"
import cors  from "cors"
import path from "path"
import {config} from "dotenv"

import  passport  from 'passport';

import { connectPassport } from "./controller/users-controllers.js"
import session from "express-session"
import cloudinary from "cloudinary"
import fileUpload from "express-fileupload"



config({path:"./config/config.env"})

const app = express()

const port =  process.env.port

// middleware
// app.use(cors({
//   origin:[process.env.front_url],
//   methods:["GET", "POST","DELETE","PUT"],
//   credentials:true
// })),
app.use(cors()),
mongoDB()
cloudinary.config({
  cloud_name:process.env.API_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
  URL:process.env.URL,
  
})
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({useTempFiles: true}))
app.use(
  session({
    secret: "dfaadasdasfxdadasdss",
    resave: false,
    saveUninitialized: false,
    name:"coockie"
  })),

app.use(passport.authenticate("session")),
app.use(passport.initialize()),
app.use(passport.session()),
app.use(express.static(path.join(__dirname,'./Frontend/build'))),

connectPassport()


// middleware

  
app.use("/auth", router)
app.use("/items",FoodRouter)
app.use("/caro",carousel)
app.use("/order",orderRouter)
app.use("/payment",paymentRouter)


app.get("*", (req,res)=>{
  res.sendFile("./Frontend/build/index.html")
})


app.listen(port, ()=>{
    console.log(`server is working ${port}`)
})