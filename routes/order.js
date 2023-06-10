import express from "express"
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { NewOrder, deleteOrders, getAllOrders, getSingleOrder, myOrders, updateOrders } from "../controller/order.js"


const router = express.Router()


// router.get("/order/:id", requireSignIn , getSingleOrder) // add admin here later
// router.post("/admin/orders", requireSignIn, isAdmin , getAllOrders) 
// router.put("/admin/orders/:id", requireSignIn, isAdmin , updateOrders) 
// router.delete("/admin/orders/:id", requireSignIn, isAdmin , deleteOrders) 


// router.post("/order/new", requireSignIn , NewOrder)
// router.post("/order/myOrders", requireSignIn , myOrders) 

export default router