import jwt from "jsonwebtoken";
import User from "../modals/users.js"

export const requireSignIn = async (req, res, next) => {

    try {

        // login panel
       if (req.cookies["google"]) {
            const token = req.cookies["google"];
            if (!token) {
                return res.status(401).json({
                    message: "please login first",
                })
            }
            next();
        } else {
            const token = req.cookies["userID"];
            // console.log(req.user.access)
            // console.log(req.user,token)
            if (!token) {
                return res.status(401).json({
                    message: "please login first",
                })
            }
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)
            // console.log(decoded)
            req.user = await User.findById(decoded._id)
            next();
        }
    } catch (error) {
        console.log(error.message);
        res.status(501).json({ error: error })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
           if(req.cookies["google"]){
            const user = await User.findById(req.user)
            // console.log(user.role, "from middleware")
       
        if (user.role !== "admin") {
            return res.status(401).json({ message: "UnAuthorized Access" })
        }
        else {
            // console.log("now its working")
            next()
        }
       }

       if(req.cookies["userID"]){
        const user = await User.findById(req.user._id)
        console.log(user)
        if (user.role !== "admin") {
            return res.status(401).json({ message: "UnAuthorized Access" })
        }
        else {
            // console.log("its workin as well too")
            next()
        }
       }

    } catch (error) {
        console.log(error.message)
        // res.status(501).json({ error: error })

    }
}




       
