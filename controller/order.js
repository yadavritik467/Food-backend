import Order from "../modals/order.js";
// import Food from "../modals/Foods.js";
// import user from "../modals/users.js";

export const NewOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,

        } = req.body;

        let order = Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
           user:req.user._id
        })

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            
        })
    }
}


// get single order

export const getSingleOrder = async(req,res)=>{
    const order = await Order.findById(req.params.id).populate("user"," name email address number")

    if(!order){
        res.status(404).json({message:"order not found by this id"})
    }
    res.status(200).json({
        success:true,
        order
    })
}


// get logged in user order

export const myOrders = async(req,res)=>{
    const order = await Order.findById({user:req.user._id})
    console.log(order)

    res.status(200).json({
        success:true,
        order
    })
}
// get all order -- admin   make sure to check this function before procceding further

export const getAllOrders = async(req,res)=>{
    const order = await Order.find()
    
    let totalAmount= 0;

    order.forEach((o)=>{
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success:true,
        totalAmount,
        order
    })
}


// update order status -- admin   make sure to check this function before procceding further

export const updateOrders = async(req,res)=>{
    const order = await Order.find(req.params.id)
    if(!order){
        res.status(404).json({message:"order not found by this id"})
    }

    if(order.orderStatus === "Delivered"){
        res.status(404).json({message:"you have already delivered this order"})
    }

    order.orderItems.foreEach(async(o)=>{
      await updateStock(o.Food,o.quantity)  
    })

    order.orderStatus = req.body.status;
    
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false})


    res.status(200).json({
        success:true,
        totalAmount,
        order
    })

    // async function updateStock(id,quantity){
    //     const food = await Food.findById(id);

    //     food.stock -= quantity;
    //     await food.save({validateBeforeSave: false})
    // }
}

// delete order -- admin   make sure to check this function before procceding further

export const deleteOrders = async(req,res)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        res.status(404).json({message:"order not found by this id"})
    }
    
    await order.remove()

    res.status(200).json({
        success:true,
        totalAmount,
        order
    })
}