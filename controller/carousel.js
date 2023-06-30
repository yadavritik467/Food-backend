import Caro from "../modals/carousel.js";
import cloudinary from "cloudinary"

 export const carouselUpdate = async (req, res) =>{
  // console.log("img details", req.body.image)
    try {
      const file = req.body.image;
        const myCloud = await cloudinary.v2.uploader.upload(file,{
            folder:"riz-carousel-image",
            resource_type: "auto",
            // width:150,
            // crop:"scale"
        })
        let {image,heading,title} = req.body
        const caro = await Caro.create({
          image:{
            public_id:myCloud.public_id,
            URL:myCloud.secure_url,
            
        },heading,title})
   
        return res.status(200).json({message:"carousel created successfully",caro})
    } catch (error) {
      console.error(error) 
      res.status(500).json({message:" error in creating carousel",error}) 
    }

 }
 export const carouselGet = async (req, res) =>{
    try {
        const caro = await Caro.find()
   
        return res.status(200).json({message:"carousel created successfully",caro})
    } catch (error) {
      console.error(error) 
      res.status(500).json({message:" error in getting carousel",error}) 
    }

 }
 export const carouselDelete = async (req, res) =>{
    try {
        let caro_Id =  await Caro.findById(req.params.id)
        // retrieve current image id...
        let imgId = caro_Id.image.public_id;
        await cloudinary.v2.uploader.destroy(imgId)
     
        let caro = await Caro.findByIdAndDelete(req.params.id)
              
        return res.status(200).json({message:"carousel deleted successfully",caro})
    } catch (error) {
      console.error(error) 
      res.status(500).json({message:" error in getting carousel",error}) 
    }

 }

