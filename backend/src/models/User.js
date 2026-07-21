import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName :{
        type:String,
        required:true,
        trim:true,
        maxlength:50,
    },
    lastName :{
        type:String,
        required:true,
        trim:true,
        maxlength:50,
    },
    email:{
         type:String,
        required:true,
         unique:true,
         trim:true,
         lowercase:true,
         match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    password:{
         type:String,
        required:true,
        minlength:8, // enforced again at the schema level, not just in the request validator
    },
     role:{
         type:String,
        enum:["user","admin"],
        default:"user",
    }
}, {timestamps:true})

const User  = mongoose.model("user", userSchema)

export default User;