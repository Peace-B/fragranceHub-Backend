import express from "express"
import { getAllUsers, getOneUser, updateUser, deleteUser, updateUserRole } from "../controllers/user.js";
import { isLoggedIn } from "../middlewares/auth.js";
import { upload } from "../helpers/multer.js";



const router = express.Router()

router.get("/all", getAllUsers)
router.get("/:userId", getOneUser)
router.put("/update", isLoggedIn, upload.single("image"), updateUser)
router.delete("/delete/:userId", deleteUser)
router.post("/user/role", isLoggedIn,  updateUserRole)







export default router