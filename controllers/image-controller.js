import Image from '../model/image.js'
import { uploadToCloudinary} from '../helpers/cloudinaryHelper.js'
import fs from 'fs'
import cloudinary from '../config/cloudinary.js'

export const  uploadImageController = async(req,res)=>{
     try {

        //check if file is missing in req object
        if(!req.file){
            res.status(400).json({success:false, message:'File is required . Please upload image'})
        }
        //upload to cloudinary
        const {url,publicId} = await  uploadToCloudinary(req.file.path)
        //store the image url and public id along with the uploaded user id in the database
        const  newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId,
            description:req.body.description
        })

        await newlyUploadedImage.save()
        //delete the file from  local storage

        res.status(201).json({success:true, message:'Image uploaded successfully',image:newlyUploadedImage})

     } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:'Something went wrong Please try again'
        })
         // Clean up: Delete the local file if upload failed
    if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (fsError) {
          console.error('Error deleting local file:', fsError);
        }
      }
  
      // Handle specific Cloudinary errors
      if (error.message.includes('Cloudinary')) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading to cloud storage'
        });
      }
     }
} 

export const fetchImagesController = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit  =  parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit

        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1: -1

        const totalImages =  await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit)

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);
            if(images){
                res.status(200).json({
                    success:true, message:'Image fetch successfully',
                    currentPage:page,
                    totalPages:totalPages,
                    totalImages:totalImages,
                    data:images
                })
            }

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Something went wrong Please try again' })
    }
}

export const deleteImageController = async(req,res)=>{
    try{
        
        const getCurrentIfOfImageToBeDeleted = req.params.id;

        const userId = req.userInfo.userId

        const image = await Image.findById(getCurrentIfOfImageToBeDeleted)

        if(!image){
            return res.status(404).json({success:false, message:"Image not found"})
        }
       

        //check if this image is uploaded by current user who is trying to delete this image
        if(image.uploadedBy.toString()!== userId){
            return res.status(403).json({success:false, message:'you are not authorize to delete this image because you have not uploaded it'})
        }
         
        //delete this image first from your cloudinary storage
        await cloudinary.uploader.destroy(image.publicId)

        //delete this image from mongodb database
         await Image.findByIdAndDelete(getCurrentIfOfImageToBeDeleted)
         res.status(200).json({success:true, message:'Image Deleted Successfully' })
          // fs.unlinkSync(req.file.path)

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Something went wrong Please try again' })
    }
}

