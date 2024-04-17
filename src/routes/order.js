import express from 'express';
import { deleteOrder, getAllOrders, getOderById, orderStatus, searchOrderByDate } from '../controllers/order.js';


const router = express.Router()

//order routes
router.put("/status/:orderId", orderStatus)
router.get("/all", getAllOrders)
router.get("/:orderId", getOderById)
router.delete("/delete/:orderId", deleteOrder)
router.get("/search/term", searchOrderByDate)

export default router;