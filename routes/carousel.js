import express from "express"
import {carouselGet, carouselUpdate ,carouselDelete} from "../controller/carousel.js"
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js"
const router = express.Router()


router.post("/caro-update",  requireSignIn,isAdmin, carouselUpdate)
router.get("/caro-get",carouselGet)
router.delete("/caro-delete/:id",  requireSignIn,isAdmin, carouselDelete)

export default router
