import  express  from "express";
import  {payment, paymentVarification}  from "../controller/payment.js";
import { requireSignIn } from "../middleware/authMiddleware.js";



const router =  express.Router()

router.post("/payment",  payment )
router.post("/paymentVarification",requireSignIn, paymentVarification )



export default router