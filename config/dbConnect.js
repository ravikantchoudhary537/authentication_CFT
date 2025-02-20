import mongoose  from "mongoose";

const dbConnect = async()=>{
        try {
            mongoose.connect(`${process.env.MONGODB_URL}/codefortomorrow`);
            console.log("Database is connected");
        } catch (error) {
            console.log("Error during Database connection");
            process.exit(1);
        }
}

export default dbConnect;