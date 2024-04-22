import Order from "../models/order.js"
import moment from 'moment';

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
  try {
    const { startDate, endDate } = req.body;

    if (!startDate && !endDate) {
      return res.status(400).json({ success: false, message: 'Start date or end date is required' });
    }

    let query = {};

    // Parse start date
    if (startDate) {
      const parsedStartDate = moment(startDate);
      console.log(parsedStartDate);

      if (!parsedStartDate.isValid()) {
        return res.status(400).json({ success: false, message: 'Invalid start date format' });
      }

      query.createdAt = { $gte: parsedStartDate.toDate() };
    }

    // Parse end date
    if (endDate) {
      const parsedEndDate = moment(endDate);
      console.log(parsedEndDate);

      if (!parsedEndDate.isValid()) {
        return res.status(400).json({ success: false, message: 'Invalid end date format' });
      }
  
      // If both start date and end date are provided, add $lte condition
      if (query.createdAt) {
        query.createdAt.$lte = parsedEndDate.toDate();
      } else {
        query.createdAt = { $lte: parsedEndDate.toDate() };
      }
    }

    const orders = await Order.find(query);

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error searching orders by date:', error.message);
    res.status(500).json({ success: false, message: 'Failed to search orders', errorMsg: error.message });
  }
};