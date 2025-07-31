const Image = require('../model/image')
const { uploadToCloudinary} = require('../helpers/cloudinaryHelper')
const fs = require('fs')

const  uploadImageController = async(req,res)=>{
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
            uploadedBy : req.userInfo.userId
        })

        await newlyUploadedImage.save()
        //delete the file from  local storage
        // fs.unlinkSync(req.file.path)

        res.status(201).json({success:true, message:'Image uploaded successfully',image:newlyUploadedImage})

     } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:'Something went wrong Please try again'
        })
     }
} 

module.exports = {
    uploadImageController
}