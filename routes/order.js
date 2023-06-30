import express from "express"
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { NewOrder, deleteOrders, getAllOrders, updateOrders } from "../controller/order.js"
import  {startWebSocketServer}  from "../webSocket.js"




const router = express.Router()
startWebSocketServer()
// router.get("/order/:id", requireSignIn,isAdmin, getSingleOrder) // add admin here later
router.get("/admin/orders",requireSignIn,  getAllOrders,) 
router.put("/admin/update-orders/:id",requireSignIn,  updateOrders) 
router.delete("/admin/orders/:id",requireSignIn, deleteOrders) 


router.post("/order/new", NewOrder,)
// router.get("/order/myOrders",  myOrders) 

export default router