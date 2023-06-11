import  express  from "express"
import  router  from "./routes/userRoutes.js"
import  carousel  from "./routes/carousel.js"
import  FoodRouter  from "./routes/Foods.js"
import  orderRouter  from "./routes/order.js"
import  paymentRouter  from "./routes/payment.js"
import  mongoDB  from "./controller/db.js"
import cors  from "cors"
// import  User  from "./modals/users.js"
import {config} from "dotenv"
// import multer from "multer"
import  passport  from 'passport';
import GoogleStrategy  from 'passport-google-oauth20'
import cookieSession from "cookie-session"
import { connectPassport } from "./controller/users-controllers.js"
import session from "express-session"
import cloudinary from "cloudinary"
import fileUpload from "express-fileupload"



config({path:"./config/config.env"})

const app = express()

const port =  process.env.port

// middleware
app.use(cors({
  // origin:[process.env.front_url],
  // methods:["GET", "POST","DELETE","PUT"],
  // credentials:true
})),
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

connectPassport()


// middleware

  
app.use("/auth", router)
app.use("/items",FoodRouter)
app.use("/caro",carousel)
app.use("/order",orderRouter)
app.use("/payment",paymentRouter)


app.get("/", (req,res)=>{
  res.send("working")
})


app.listen(port, ()=>{
    console.log(`server is working ${port}`)
})