import { connectDB } from "./src/db.config.js";
import dotenv from "dotenv"
import express from "express"
import router from "./src/routes/auth.js"
import categoryRouter from "./src/routes/category.js"
import userRouter from "./src/routes/user.js"
import productRouter from "./src/routes/product.js"
import orderRouter from './src/routes/order.js';



dotenv.config();

//initialise express server
const app = express()
app.use(express.json())

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


app.listen(port, (req, res) => {
    console.log(`fragrancehub server listening on port ${port}`);
})
