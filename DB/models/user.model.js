import { Schema, model } from "mongoose";



const userScehma = new Schema({
  firstName:String,
  email:{
    type:String,
    unique:true
  },
  password:String,
  isConfirmed:{
    type:Boolean,
    default:false
  },
  isLoggedIn:{
    type:Boolean,
    default:false
  },
  code:{
    type:String,
    default:''
  },
  covers:[String] ,
  coversId:[String],
  profilePic:String,
  publicId:{
    type:String,
    default:''
  },
},{
    timestamps:true
})



const userModel = model.User || model('User',userScehma)



export default userModel;