import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import User from "../modals/users.js"
import sendPasswordResetEmail from "../utils/sendPasswordResetEmail.js"
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


export const connectPassport = (res) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:4500/auth/google/callback",
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
        // scope: ['profile', 'email',
        //  'https://www.googleapis.com/auth/user.phonenumbers.read', 
        // 'https://www.googleapis.com/auth/user.addresses.read'],
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
                    number: profile.phone_number,
                    address: profile.address,
                });

                console.log(user)
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

        let { name, number, email, password, address } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {

            return res.status(200).json({ message: "this email is already in use", existingUser })
        }
        const existingNumber = await User.findOne({ number })
        if (existingNumber) {

            return res.status(200).json({ message: "this number is already in use", existingNumber })
        }
        const hashPassword = bcrypt.hashSync(password, 10)
        // const chashedPassword = bcrypt.hashSync(cpassword, 10)
        const user = await User.create({
            name,
            number,
            email,
            password: hashPassword,
            address
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

        const user = await User.findOne({ email: req.body.email }).select("+password")

        // console.log(user,req.body)
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist !! please create account ",user })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password", })
        }

        // token
        console.log(user._id)
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "365d", })
        return res.json({
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
        return res.status(201).json({ message: "All users lists", user })
    } catch (err) {
        return res.status(500).json({ message: "error in getting all users" });
    }

}

// forgot password

export const forgotPassword = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        };

        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "365d", })


        await user.save();

        await sendPasswordResetEmail({ email: user.email, token });

        return res.status(201).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


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