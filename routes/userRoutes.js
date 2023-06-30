import express from "express";
import jwt from "jsonwebtoken";
import { register, login, usersController, deleteUsersController, forgotPassword } from "../controller/users-controllers.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import passport from 'passport';
const router = express.Router()




router.post("/login", login)


// --------------------------------------------------------- google authentication

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile","email",'openid',
         'https://www.googleapis.com/auth/user.addresses.read',
          'https://www.googleapis.com/auth/user.phonenumbers.read']
    }))

router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login' }),
(req, res) => {
  const { _id, email, name, number, address } = req.user;

  // Generate JWT token
  const token = jwt.sign({ _id, email, name, number, address }, process.env.JWT_SECRET, { expiresIn: "365d", });

  // Save JWT token in local storage
  res.cookie("userID", token ,{ httpOnly: true});
//   console.log(token)
  res.redirect('http://localhost:3000');
}
);

// --------------------------------------------------------- google authentication ends here
   
    router.post("/register", register)
    router.post("/forgotPassword", forgotPassword)
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