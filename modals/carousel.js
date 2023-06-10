import mongoose from "mongoose"

const caroSchema = new mongoose.Schema({
    image:{
        public_id:{
            type:String,
            required:true
        },
        URL:{
            type:String,
            required:true
        },
    },
    heading:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    }
})

const caro =  mongoose.model('Caro', caroSchema)

export default caro