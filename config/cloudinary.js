import {v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

export default cloudinary

// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';

// // Initialize environment variables
// dotenv.config();

// // Validate required Cloudinary configuration
// const requiredConfig = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
// const missingConfig = requiredConfig.filter(key => !process.env[key]);

// if (missingConfig.length > 0) {
//   throw new Error(`Missing Cloudinary config: ${missingConfig.join(', ')}`);
// }

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true // Force HTTPS
// });

// export default cloudinary;