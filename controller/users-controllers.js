import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import  User  from "../modals/users.js"
// import { google } from "../modals/google.js"
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


// export const connectPassport = () => {
// //     passport.use(new GoogleStrategy({
// //         clientID: process.env.CLIENT_ID,
// //         clientSecret: process.env.CLIENT_SECRET,
// //         callbackURL: "http://localhost:4500/auth/google/callback",
// //         passReqToCallback: true
// //     },
// //         async (req, accessToken, refreshToken, profile, done) => {
     
         
// //                 console.log(profile);
// //             const user = await google.findOne({
// //                 googleId: profile.id,
// //             },)
// //             if(!user){
// //                 const newUser = new google({
// //                     googleId: profile.id,
// //                     name: profile.displayName,
// //                     // number: profile.number,
// //                     // email: profile.email,
// //                     secret: accessToken,
// //                 });
// //                 await newUser.save().then((result)=>{
// //                     console.log(newUser);
// //                     return done(null,user)
// //                 })
// //             }else{
// //                 console.log(user)
// //                 return done(null,user)
// //             }
// //             // console.log(user.email);
// //             // return done(null, user);     
            
// //         }
// //     )
// //     )
// //     passport.serializeUser(function (user, done) {
// //     done(null, user.id);
// //  });
 
// //  passport.deserializeUser(async (user, done)=> {
// //     const newUser = await User.findById(id)
// //     done(null, newUser.id);
// //  })
// }





export const register = async (req, res, next) => {
    const { name, number, email, password, address } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashPassword = bcrypt.hashSync(password, 10)
        const user = new User({
         
            name,
            number,
            email,
            password: hashPassword,
            address,
        })
        await user.save()
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "10s", })

        res.status(201).json({ message: "user succesfully created",token })
    } catch (error) {
        console.log(error)
        return res.status(501).json({ message: "Internal server errord" })
    }
}


export const login = async (req, res, next) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email: req.body.email }).select("+password")
          
        console.log(user,req.body)
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist !! please create account " })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        // token
            console.log(user._id)
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "365d", })
        res.json({
            message: "login successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phone: user.number,
                role: user.role
            },
        })
      
    } catch (error) {
        console.log(error);
        return res.status(501).json({ message: "Internal server errord" })
    }
}

export const usersController = async (req, res) => {
    try {
        const user = await User.find({})
        res.status(201).json({ message: "All users lists", user })
    } catch (err) {
        res.status(500).json({ message: "error in getting all users" });
    }

}

// delete category
export const deleteUsersController = async (req, res) => {
    try {
        const _id = req.query.id;
        // console.log(req.query)
        const user = await User.findByIdAndDelete(_id)
        res.status(201).json({ message: " Deleted User " })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "error in deleting  user" });
    }

}