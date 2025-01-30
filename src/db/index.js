import mongoose from "mongoose"
const DB_NAME="FinanceAPP"


const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection failed",err);
        process.exit(1);
    }
}

export default connectDB