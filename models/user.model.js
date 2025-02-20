import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
})

const User = mongoose.model("User",userSchema);
export default User;