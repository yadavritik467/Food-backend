import trackPageView from "../utils/googleAnalitycal.js";
import express from "express";


const router = express.Router();


// Route for tracking page views
router.get('*', trackPageView);

export default router
