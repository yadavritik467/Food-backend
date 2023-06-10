import  express  from "express";
import  {payment, paymentVarification}  from "../controller/payment.js";



const router =  express.Router()

router.post("/payment", payment )
router.post("/paymentVarification", paymentVarification )



export default router