import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{ type: String,trim:true, },
    number:{ type: Number,trim:true, },
    googleId:{ type: String,trim:true, unique:true,required: true},
    password:{ type: String,},
    role:{type:Number,default:0},
    createdAt:{ type: Date, default:Date.now}
    
},{timestamps:true})

export const google = mongoose.model("google",userSchema)

