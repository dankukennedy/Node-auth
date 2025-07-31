const mongoose = require("mongoose")

const  UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        trim: true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim: true,
        lowercase :true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ['user','admin'],
        default: 'user'
    },
    contact:{
        type: Number,
        require:true,
        unique:true,
        trim: true
    },
    bio:{
        type:String,
        trim: true
    }
},{timestamps:true})

module.exports = mongoose.model('User', UserSchema);