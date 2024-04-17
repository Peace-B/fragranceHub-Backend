import express from 'express';
import {forgotPassword, login, resetPassword, signUp} from '../controllers/auth.js'
import { upload } from '../helpers/multer.js';

const router = express.Router()

router.post("/login", login)
router.post("/signup", upload.single('image'), signUp)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)


export default router