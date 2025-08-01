import express from "express"
import {registerUser, loginUser ,changePassword, updateUserDetails} from "../controllers/auth-controller.js"
import {authMiddleware } from "../middleware/auth-middleware.js"

const router = express.Router();

//all routes are related ro authentication and authorization
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password',authMiddleware ,changePassword)
router.put('/update-details',authMiddleware,updateUserDetails)

export default router