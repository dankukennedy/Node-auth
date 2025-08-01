import cloudinary from '../config/cloudinary.js'

export  const uploadToCloudinary = async(filePath)=>{
  try {
    const result = await cloudinary.uploader.upload(filePath)
    return {
        url: result.secure_url,
        publicId: result.public_id,
    }
  } catch (error) {
    console.error('Error whiles uploading to cloudinary',error)
    throw new Error('Error whiles uploading to cloudinary')
  }
}

