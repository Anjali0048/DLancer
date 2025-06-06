import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`MongoDB connected to database`)
    } catch (error: any) {
        console.log(error.message);
    }
}

export default connectDB;