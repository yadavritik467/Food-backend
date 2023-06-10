import JWT from "jsonwebtoken";
import  User  from "../modals/users.js"

export const requireSignIn = async (req, res, next) => {
    
    try {
        const token =  req.headers.authorization
        const decode =   JWT.verify(token,process.env.JWT_SECRET)
        req.user = decode.user;
        // console.log(decode,token,"hii")
        next()
    } catch (error) {
        console.log(error);
        res.status(501).json({error: error})
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        // console.log(req.user._id)
                if (user.role !== "admin") {
                    return res.status(401).json({ message: "UnAuthorized Access" })
                }
                else{
                    next()
                }

    } catch (error) {
        console.log(error)
        res.status(501).json({error: error})

    }
}