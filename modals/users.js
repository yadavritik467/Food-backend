import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true,  },
    number: { type: Number, trim: true,   },
    email: { type: String, trim: true, unique: true,  },
    googleId:{ type: String,trim:true, },
    password: { type: String,  select: false },
    // cpassword: { type: String,  select: false },
    address: { type: String, },
    // role: { type: Number, default: 0 },
    role: { type: String, default: "user" },
    resetPsswordToken: { type: String },
    resetPsswordExpire: { type: Date },
    createdAt: { type: Date, default: Date.now }

}, { timestamps: true })

 const  User = mongoose.model("User", userSchema)

 export default User
