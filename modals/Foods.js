import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
   
    title: { type: String, unique: true,  },
    image: {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }

    },
    category: { type: String, require: true },
    price: { type: Number,  },
 
  
    createdAt:{ type: Date, default:Date.now}

})

const Food = mongoose.model("foods", FoodSchema)


export default Food

