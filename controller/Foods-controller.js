import Food from "../modals/Foods.js";
import cloudinary from "cloudinary"


export const FoodController = async (req, res) => {
//  console.log("img details", req.body.image)
    try {
        const file = req.body.image;
        const myCloud = await cloudinary.v2.uploader.upload(file,{
            folder:"riz-food-image",
            resource_type: "auto",
            // width:150,
            // crop:"scale"
        })
        let {image,title,category,price} = req.body
        

        const food = await Food.create({image:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
            
        },title,category,price})
        res.status(201).json({
            success: true,
            food
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "error in creating food" });
    }
   

}






// update category
export const updateFoodController = async (req, res) => {


    // try {
    //     let food = await Food.findById(req.params.id)

    //     if (!food) {
    //         res.status(500).json({
    //             success: false,
    //             message: "Food not found"
    //         })
    //     }

    //     food = await Food.findByIdAndUpdate(req.params.id, req.body, {
    //         new: true,
    //         runValidators: true,
    //         useFindAndModify: false

    //     })

    //     res.status(500).json({
    //         success: true,
    //         message: "Food updated successfully",
    //         food
    //     })
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({ message: "error in updating Item" });
    // }
}


// single food details
export const singleFoodController = async (req, res) => {


   try {
    let food = await Food.findById(req.params.id)

    if (!food) {
        res.status(500).json({
            success: false,
            message: "Food not found"
        })
    }


    res.status(500).json({
        success: true,
        food
    })
    
   } catch (error) {
    console.log(error)
        res.status(500).json({ message: "error in getting single food" });
   }


}



// delete category
export const deleteFoodController = async (req, res) => {

  
    try {
        let food_Id =  await Food.findById(req.params.id)
        // retrieve current image id...
        let imgId = food_Id.image.public_id;
        await cloudinary.v2.uploader.destroy(imgId)
        let food = await Food.findById(req.params.id)

        if (!food) {
            res.status(500).json({
                success: false,
                message: "Food not found"
            })
        }
    
        await Food.findByIdAndDelete(req.params.id)
    
        res.status(500).json({
            success: true,
            message: "Food deleted successfully",
            food
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "error in deleting  Food" });
    }
    //   uncomment it if above code is not working
    // try {
    //     const _id = req.query.id;
    //     // console.log(req.query)
    //     const existingFoods = await Food.findByIdAndDelete(_id)
    //     res.status(201).json({ message: " Deleted Food ", existingFoods })
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({ message: "error in deleting  Food" });
    // }

}




// get all food

export const foodGetController = async (req, res) => { 

    // req.body.user = req.user.id;
    try {
        const foodCount = await Food.countDocuments()
          const food = await Food.find({})
        res.status(201).json({
            success: true,
            food,
            foodCount
        })
    } catch (err) {
        res.status(500).json({ message: "error in getting all Foods" });
    }
    //   uncomment it if above code is not working

    // try {
    //     const existingFoods_1 = await Food.find()
    //     if (existingFoods_1) {
    //         return res.status(200).json({ existingFoods_1 })
    //     }
    // } catch (err) {
    //     res.status(500).json({ message: "error in getting all Foods" });
    // }

}
