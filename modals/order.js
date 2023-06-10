import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    state: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    pincode: {
      type: Number,
      // required: true,
    },
    address: {
      type: String,
      // required: true,
    },
  },


  OrderItems: 
    {
      title: {
        type: String,
        // required: true,
      },
      price: {
        type: String,
        // required: true,
      },
      quantity: {
        type: String,
        // required: true,
      },
      thumbnail: {
        type: String,
        // required: true,
      },
      Food: {
        type: mongoose.Schema.ObjectId,
        ref: "foods",
        // required: true,
      }
    }
  ,

  user:{
    type:mongoose.Schema.ObjectId,
    ref: 'User', 
  // required:true
},

  paymentInfo:{
    id:{
      type: String,
      // required: true,
    },
    status:{
      type: String,
      // required: true,
    },
  },
  paidAt :{
    type: Date,
    // required: true,

  },
  itemsprice: {
    type: Number,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  orderStatus:{
    type:String,
    // required:true,
    default:"processing"
  },
  deliveredAt:Date,
  createdAt:{
    type:Date,
    default:Date.now
  },

  },   

 )

const order = mongoose.model('Order', orderSchema)

export default order