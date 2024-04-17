import Order from "../models/order.js"

export const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(orderId,{status}, {new: true})
        if(!order){
            return res.status(404).json({success: false, message: 'Order not found'});
        }

    res.status(200).json({success: true, message: `Your Order status has been changed to "${status}"`, orderStatus: order.status})    
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: err.message}); 
    }
}

// create the following endponts

// getAllOrders
export const getAllOrders = async(req, res)=>{
    try {
        const orders = await Order.find()
        res.json({success: true, message: "Orders retrieved successfully", orders})
    } catch (err) {
        res.status(500).json({message: false, message: err.message});
    }
  }

// getOrderById
export const getOderById = async(req, res)=>{
    try {
        const { orderId }= req.params;
        const order = await Order.findById({_id: orderId})
    if(!order){
          res.status(404).json({success: false, message: 'Order not found'})
        }
    res.json({success: true, message: 'product retrieved successfully', order})
    } catch (err) {
      console.log("", err.message);
        res.status(500).json({message: false, message: err.message});
    }
}

// deleteOrder
export const deleteOrder = async(req, res)=>{
    try {
        const { OrderId } = req.params
        const order = await Order.deleteOne({OrderId})
        if(!order) {
          return res.status(400).json({success: false, message: 'Product not found'})
        }
        res.json({success: true, message: 'Product deleted successfully', order})   
    } catch (err) {
        res.status(500).json({message: false, message: err.message});
    }
}

// Controller function to search orders by date or date range with pagination
export const searchOrderByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      let query = {};
  
      // Check if both startDate and endDate parameters are provided
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (startDate) {
        // If only startDate is provided, search orders created on or after startDate
        query.createdAt = { $gte: new Date(startDate) };
      } else if (endDate) {
        // If only endDate is provided, search orders created on or before endDate
        query.createdAt = { $lte: new Date(endDate) };
      }
  
      // Search orders based on the constructed query
      const orders = await Order.find(query).skip(skip).limit(limit);
      const totalOrders = await Order.countDocuments(query);
  
      res.json({
        currentPage: page,
        ordersFound: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        orders,
      });
    } catch (err) {
      console.error("Error searching orders by date:", err.message);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to search orders",
          errorMsg: err.message,
     });
  }
  };
  
