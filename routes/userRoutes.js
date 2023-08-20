import express from "express";
import jwt from "jsonwebtoken";
import { register, login, usersController, deleteUsersController, forgotPassword, resetPassword, myProfile, logOut, googleLogout } from "../controller/users-controllers.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import passport from 'passport';
const router = express.Router()




router.post("/login", login)


// --------------------------------------------------------- google authentication

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile","email",
        //  'https://www.googleapis.com/auth/user.addresses.read',
        //   'https://www.googleapis.com/auth/user.phonenumbers.read'
        ]
    }))

router.get("/google/callback", passport.authenticate('google',
 {  successRedirect: "http://localhost:3000",}),
);

// --------------------------------------------------------- google authentication ends here
   
    router.post("/register", register)
    router.post("/forgotPassword", forgotPassword)
    router.put("/resetPassword", resetPassword)
router.get("/getUser",requireSignIn,isAdmin, usersController)

router.get("/logout",requireSignIn,logOut)
router.get("/googleLogout",requireSignIn,googleLogout)
router.get("/myProfile",requireSignIn,myProfile)

router.delete("/delete-users",requireSignIn, deleteUsersController)

// protected routes
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

// admin routes











export default router
