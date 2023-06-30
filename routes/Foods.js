import  express  from "express";
import { requireSignIn, isAdmin, } from "../middleware/authMiddleware.js";

import { FoodController, deleteFoodController, foodGetController,  updateFoodController } from "../controller/Foods-controller.js";



const router =  express.Router()

  
  
  
           router.post("/create-foods", requireSignIn, isAdmin, FoodController )     //add admin here later
            router.delete("/delete-foods/:id",requireSignIn, isAdmin, deleteFoodController )   //add admin here later


              router.put("/update-foods/:id", updateFoodController )   //add admin here later

              router.get("/foods", foodGetController )


export default router



