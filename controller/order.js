import Order from "../modals/order.js";
import { increasePendingOrdersCount } from '../webSocket.js';

export const NewOrder = async (req, res) => {
    try {
        const {userID,user,email, FoodID, quantity, address,OrderStatus,PaymentMethod,paymentInfo} = req.body.orderDetail;
 
           
    //    let total = 

        const order =await Order.create({
            userID,user,email,
            FoodID,
            quantity,
            totalPrice: req.body.amount * 100 ,
            total:(req.body.amount + 20) * 100 ,
            address,
            OrderStatus,
            PaymentMethod,
            paymentInfo,
            paidAt: Date.now(),       
        })
        if(order){
            return res.status(200).json({success: true,order, })
        }
           increasePendingOrdersCount()

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            
        })
    }
}


export const getAllOrders = async(req,res)=>{
    try {
        const order = await Order.find().sort({createdAt:-1})
        
    let totalRevenu= 0;

    order.forEach((o)=>{
        totalRevenu = totalRevenu + o.total
    })



    return res.status(200).json({
        success:true,
        totalRevenu,
        order
    })
    } catch (error) {
        console.log(error)     
        return res.status(500).json({
        success:false,
        message:"internal server error"
    })

    }
}


// update order status -- admin   make sure to check this function before procceding further

export const updateOrders = async(req,res)=>{

    const order = await Order.findById(req.params.id,{new:true}).sort({updatedAt:-1})
        
    order.OrderStatus = req.body.category;
    order.paymentInfo = req.body.paymentStatus;
    
    await order.save()

    return res.status(200).json({
        message: 'Order updated successfully',
        success:true,
        order
    })

    
}

// delete order -- admin   make sure to check this function before procceding further

export const deleteOrders = async(req,res)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        res.status(404).json({message:"order not found by this id",order})
    }
    
    await Order.findByIdAndDelete(req.params.id)

    return res.status(200).json({
        success:true,
        message:"order deleted successfully",
       
    })
}