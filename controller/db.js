import mongoose  from "mongoose"

export const mongoDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
    console.log("db is connected")
}

// const mongoDB = mongoose.connect("mongodb+srv://yadavritik467:ritik23121999@cluster0.bo6svw3.mongodb.net/riz-store")
// .then(()=> console.log("db is connected"))
// .catch(()=> console.log("not connected to db"))

export default mongoDB