import mongoose from "mongoose"
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true,  },
    number: { type: Number, trim: true, default:null   },
    email: { type: String, trim: true, unique: true,  },
    access:{ type: String, default: 'registerForm' },
    googleId:{ type: String,trim:true, },
    password: { type: String,  select: false },
    // cpassword: { type: String,  select: false },
    address: { type: String, default:null },
    // role: { type: Number, default: 0 },
    role: { type: String, default: "user" },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now }

}, { timestamps: true })

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const token = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return token;
  };

 const  User = mongoose.model("User", userSchema)

 export default User
