import  express  from "express"
import http from 'http';
import { startWebSocketServer } from './webSocket.js';
import  router  from "./routes/userRoutes.js"
import  carousel  from "./routes/carousel.js"
import  FoodRouter  from "./routes/Foods.js"
import  orderRouter  from "./routes/order.js"
import  paymentRouter  from "./routes/payment.js"
import  trackPageRouter  from "./routes/googleAnalitycal.js"
import  mongoDB  from "./controller/db.js"
import cors  from "cors"
import session from "express-session"
import {config} from "dotenv"
import cloudinary from "cloudinary"
import fileUpload from "express-fileupload"
import passport from "passport"
import { connectPassport } from "./controller/users-controllers.js"
// import path from "path"
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

config({path:"./config/config.env"})



const app = express();
const server = http.createServer(app);



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const port =  process.env.PORT






// middleware

app.use(cors()),
mongoDB()
cloudinary.config({
  cloud_name:process.env.API_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
  URL:process.env.URL,
  
})
app.use(express.json())
app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
// app.use('/',express.static('./Frontend/build/'))
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({useTempFiles: true}))
connectPassport()


// middleware

  
app.use("/analytics", trackPageRouter)
app.use("/auth", router)
app.use("/items",FoodRouter)
app.use("/caro",carousel)
app.use("/order",orderRouter)
app.use("/payment",paymentRouter)


startWebSocketServer(server)



app.get('/',(req,res)=>{
  res.send('working')
})
app.listen(port, ()=>{
    console.log(`server is working ${port}`)
})


