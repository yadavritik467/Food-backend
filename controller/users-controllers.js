import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import crypto from "crypto"
import User from "../modals/users.js"
import sendPasswordResetEmail from "../utils/sendPasswordResetEmail.js"
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


export const connectPassport = (res) => {
    passport.use(new GoogleStrategy({
        session:false,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:4500/auth/google/callback",
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
        scope: ['profile', 'email',
        //  'https://www.googleapis.com/auth/user.phonenumbers.read', 
        // 'https://www.googleapis.com/auth/user.addresses.read'
    ],
        passReqToCallback: true
    },
        async (req, res, accessToken, refreshToken, profile, done) => {


            // console.log(profile);
            const existingUser = await User.findOne({
                googleId: profile.id,
            })

            if (existingUser) {
                // User already exists, return the user

                done(null, existingUser);
            } else {

                // Create a new user
                const user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    secret: accessToken,
                    access:"google",
                    // number: profile.phone_number,
                    // address: profile.address,
                });

                // console.log(user)
                done(null, user,);

            }


        }
    )
    )
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async (user, id, done) => {
        const newUser = await User.findById(id)
        done(null, newUser.id);
    })
}

export const register = async (req, res) => {
    try {
        let { name, number, email, password, address, } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {

            return res.status(200).json({ message: "this email is already in use", existingUser })
        }
        const hashPassword = bcrypt.hashSync(password, 10)
        // const chashedPassword = bcrypt.hashSync(cpassword, 10)
        const user = await User.create({
            name,
            number,
            email,
            password: hashPassword,
            address,
        })
        await user.save()
        return res.status(200).json({ message: "user created successfully", user })
    } catch (error) {
        console.log(error)
        res.status(500).json("internal server")
    }
}



export const login = async (req, res, next) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email }).select("+password")

        // console.log(user,req.body)
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist !! please create account ", user })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password", })
        }

        // token
        // console.log(user._id)
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "365d", })
        return res.cookie("userID",token,{ 
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
             httpOnly: true,
             }).json({
            message: "login successfully",
            token,
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(501).json({ message: "Internal server errord" })
    }
}

export const logOut = async (req, res) => {
    try {
        if(req.cookies["userID"]){
            // console.log("userID cookie cleared")
            res.status(200)
            .cookie("userID", null, { expires: new Date(Date.now()), httpOnly: true })
            .json({ success: true, message: "logout successfully" })

        }

        if(req.cookies["google"]){
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                }

                // Clear the userID cookie
                res.clearCookie('google');
                res.status(200).json({message:"logout successfully"});
                // console.log("google  cookie cleared")

            });

        }
        

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message, })
    }
}

export const googleLogout = (req,res) =>{
    // try {
    //     if(req.cookies["google"]){
    //         req.session.destroy((err) => {
    //             if (err) {
    //                 console.error('Error destroying session:', err);
    //             }

    //             // Clear the userID cookie
    //             res.clearCookie('google');
    //             res.status(200).json({message:"logout successfully"});
    //             // console.log("clear cookie", req.cookies)

    //         });

    //     }
    // } catch (error) {
    //     console.error(error.message);
    // }
}

export const myProfile = async(req,res) =>{
    try {
        // for login
        if(req.cookies["userID"]){
            const user = await User.findById(req.user._id);

            console.log(user,"cookie is true")
            // console.log("user is admin")
        return res.status(200).json({
            success: true,
            user
        })
        }

        // for google
        if (req.cookies["google"]) {
            const user = await User.findById(req.user);
            // console.log(user)
            return res.status(200).json({
                success: true,
                user
            });
        }
       
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });
    }
} 

export const usersController = async (req, res) => {
    try {
        const user = await User.find({})
        return res.status(201).json({ message: "All users lists", user })
    } catch (err) {
        return res.status(500).json({ message: "error in getting all users" });
    }

}

// forgot password

export const forgotPassword = async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' })
    };

    const token = user.getResetPasswordToken()
    await user.save();
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${token}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendPasswordResetEmail({ email: user.email, token, message });
        return res.status(201).json({ message: `link has been  sent successfully in this ${user.email}.` });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

// reset password 

export const resetPassword = async (req, res) => {
//     try {
//       const { resetToken, newPassword } = req.body;
  
//       // Find the user with the reset password token
//       const user = await User.findOne({
//         resetPasswordToken: resetToken,
//         // resetPasswordExpires: { $gt: Date.now()  }
//       });
  
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid or expired reset password token' });
//       }
  
//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
  
//       // Update user's password
//       user.password = hashedPassword;
//       user.resetPasswordToken = undefined;
//     //   user.resetPasswordExpires = undefined;
//       await user.save();
  
//       return res.status(200).json({ message: 'Password reset successful' });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
  };


// delete category
export const deleteUsersController = async (req, res) => {
    try {
        const _id = req.query.id;
        // console.log(req.query)
        const user = await User.findByIdAndDelete(_id)
        return res.status(201).json({ message: " Deleted User " })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "error in deleting  user" });
    }

}
