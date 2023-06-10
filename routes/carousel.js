import express from "express"
import {carouselGet, carouselUpdate ,carouselDelete} from "../controller/carousel.js"
const router = express.Router()


router.post("/caro-update",carouselUpdate)
router.get("/caro-get",carouselGet)
router.delete("/caro-delete/:id",carouselDelete)

export default router