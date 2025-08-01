import mongoose from "mongoose"

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
        type: String,
        require:true,
        unique:true,
        trim: true
    },
    bio:{
        type:String,
        trim: true
    }
},{timestamps:true})

export default mongoose.model('User', UserSchema);