import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  
  
      
      Food: {
        type: mongoose.Schema.ObjectId,
        ref: "foods",
        
      },
   
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",

  },
  paymentInfo: {
    id: {
      type: String,
     
    
    },
    status: {
      type: String,
      default:"paid"
    
    },
  },
  paidAt: {
    type: Date,

  },
 
 
  
  totalPrice: {
    type: Number,
    
    default: 0,
  },
  orderStatus: {
    type: String,

    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const order = mongoose.model('Order', orderSchema)

export default order