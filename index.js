import { connectDB } from "./src/db.config.js";
import dotenv from "dotenv"
import express from "express"
import router from "./src/routes/auth.js"
import categoryRouter from "./src/routes/category.js"
import userRouter from "./src/routes/user.js"
import productRouter from "./src/routes/product.js"
import orderRouter from './src/routes/order.js'
import ratingRouter from "./src/routes/rating.js"
import cors from "cors"



dotenv.config();

//initialise express server
const app = express()
app.use(express.json())
app.use(cors(["http://localhost:5173", "http://localhost:5173"]))

const port = process.env.PORT
const dbUrl = process.env.MONGODB_URL
// console.log(port);
// console.log(dbUrl)
console.log("server started");

//to connect to MongoDB
connectDB(dbUrl)
  
//testing the endpoint
// app.get("/", (req, res) => {
//     res.json({success: true, message: "OK"})
// })

//routes
app.use("/auth", router)
app.use("/api/category", categoryRouter)
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/order", orderRouter)
app.use("/api", ratingRouter)


app.listen(port, (req, res) => {
    console.log(`fragrancehub server listening on port ${port}`);
})
