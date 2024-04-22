import express from "express"
import { rateProduct } from "../controllers/rating.js";
import { isLoggedIn } from "../middlewares/auth.js"

const router = express.Router();

router.post("/rating/:productId", isLoggedIn, rateProduct)






export default router;