import  mongoose from "mongoose";

const connectToDB = async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed');
        process.exit(1);
    }
}

export default connectToDB;