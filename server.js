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
import cookieParser from "cookie-parser"
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


mongoDB()
cloudinary.config({
  cloud_name:process.env.API_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
  URL:process.env.URL,
  
})
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({limit:"50mb",extended: true}));
app.use(
  cors({
    origin: 'http://localhost:3000', // Update this to match your frontend's origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(
  session({
    name:"google",
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,

  })
  );

  app.use(cookieParser())



// Initialize Passport.js
app.use(passport.authenticate("session"));
connectPassport()
app.use(passport.initialize());
app.use(passport.session());

// app.use('/',express.static('./Frontend/build/'))




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


