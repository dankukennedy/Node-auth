const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    url:{
        type:String,
        required: true,
    },
      publicId:{
        type:String,
        required:true
      }
    ,
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    description:{
      type:String,
      require: true,
      trim: true,
      maxLength: [100,'Image description cannot be more than 100 characters']
    }

}, {timestamps: true});

module.exports = mongoose.model('Image',ImageSchema)