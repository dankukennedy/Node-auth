import express from 'express'
import {authMiddleware } from '../middleware/auth-middleware.js'
import {isAdminUser} from '../middleware/admin-middleware.js'
import multer  from '../middleware/upload-middleware.js'
import {uploadImageController, fetchImagesController, deleteImageController}  from '../controllers/image-controller.js'

const router = express.Router()
//upload the image
router.post("/upload", authMiddleware, isAdminUser,multer.single('image'), uploadImageController) 
//to get all image
router.get("/all",authMiddleware, fetchImagesController)
//delete Image route

router.delete('/:id',authMiddleware,isAdminUser,deleteImageController)

export default router