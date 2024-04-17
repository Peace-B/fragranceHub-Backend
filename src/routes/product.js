import express from "express"
import { createProduct, getAllProducts, getOneProduct, updateProduct, deleteProductById, getProductBySlug, searchProduct, relatedProduct, processPayment} from "../controllers/product.js"
import { upload } from "../helpers/multer.js"
import { isLoggedIn } from "../middlewares/auth.js"
import { searchOrderByDate, deleteOrder, getAllOrders, getOderById, orderStatus } from "../controllers/order.js"


const router = express.Router()

 router.post("/create", upload.array("images", 5), createProduct)
 router.get("/all", getAllProducts)
 router.get("/:productId", getOneProduct)
 router.put("/update/:productId", upload.array("images", 5), updateProduct)
 router.get("/slug/:slug", getProductBySlug)
 router.delete("/:productId", deleteProductById)
 router.post("/search", searchProduct)
 router.get("/related/:productId", relatedProduct)

 //payment routes
 router.post("/payment", isLoggedIn, processPayment)


//order routes
 router.put("/order-status/:orderId", orderStatus)
 router.get("/order-all", getAllOrders)
 router.get("/order/:orderId", getOderById)
 router.delete("/order-delete/:orderId", deleteOrder)
 router.post("/search-order", searchOrderByDate)

 export default router

