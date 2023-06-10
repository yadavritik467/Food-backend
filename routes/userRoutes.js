import express from "express";
import { register, login, usersController, deleteUsersController } from "../controller/users-controllers.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
// import passport from 'passport';
const router = express.Router()




router.post("/login", login)
// router.get(
//     "/google",
//     passport.authenticate("google", {
//         scope: ["profile"]
//     }))
// router.get("/google/callback",  (req,res)=>{
//     res.send("logged")
// }),
// router.get("/google/callback", passport.authenticate("google", { succesRedirect: "http://localhost:3000" }), function (req, res) {
//     res.redirect("http://localhost:3000/login")
// }),

   
    router.post("/register", register)
router.get("/getUser", usersController)
router.delete("/delete-users", deleteUsersController)

// protected routes
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

// admin routes
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})










export default router