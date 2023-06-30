import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userID:{ type: mongoose.Schema.Types.ObjectId,ref:"User "},
    razorpay_order_id:{
    type: 'string', required: true,
},
    razorpay_payment_id:{
    type: 'string', required: true,
},
    razorpay_signature:{
    type: 'string', required: true,
}

}, { timestamps: true })

const payments = mongoose.model("payments", paymentSchema)


export default payments