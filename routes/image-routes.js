const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware')
const {uploadImageController, fetchImagesController, deleteImageController} = require('../controllers/image-controller')

const router = express.Router()
//upload the image
router.post("/upload", authMiddleware, adminMiddleware,uploadMiddleware.single('image'), uploadImageController) 
//to get all image
router.get("/get",authMiddleware, fetchImagesController)
//delete Image route
//688b9c278c58aeaac0fa37cc
router.delete('/:id',authMiddleware,adminMiddleware,deleteImageController)

module.exports = router