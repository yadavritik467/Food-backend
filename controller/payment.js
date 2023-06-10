import Razorpay from 'razorpay';
import crypto from 'crypto';
import payments from "../modals/payment.js";

export const payment = async (req, res) => {

    try {
        const instance = new Razorpay({
            // this key id and key secret are essential for making payment 
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET
        });
        const options = {
            amount: req.body.amount * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };
        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "womthing went wrong" });
            }
            res.status(200).json({ data: order })
        });
    } catch (error) {
        console.log(error)
        res.status(501).json({ success: false, message: "internal server error" });
    }

}

export const paymentVarification = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const sign = razorpay_order_id + "|" + razorpay_payment_id;



    var expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        await payments.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })
        res.status(200).json({ message: "payment verified successfully" });


    } else {
        res.status(200).json({ message: "invalid signature sent" });
    }



}
