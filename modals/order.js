import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  userID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  user: {
    type: Array,
    required: true,
  },
  

  FoodID: {
    type: Array,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryCahrge: {
    type: Number,
    default:20,
  },
  total:{
    type: Number,
  },
  OrderStatus: {
    type: String,
    //  enum:["processing","Delivered","cancle"],
    default: "processing"

  },
  previousOrderStatus: {
    type: String,
    //  enum:["processing","Delivered","cancle"],
    default: "Your previous order :"

  },

  PaymentMethod:{
    type: String,
  },

  paymentInfo: {
      type: String,
      default: "paid"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  paidAt: {
    type: Date,
  },
});

const order = mongoose.model('Order', orderSchema)

export default order