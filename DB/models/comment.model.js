import { Schema, model } from "mongoose";



const commentSchema = new Schema({

comment:{
    type:String,
    required:true
},
commentedBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
postId:{
    type:Schema.Types.ObjectId,
    ref:'Post'
}
},{
  timestamps:true  
})



const commentModel = model.Comment || model('Comment',commentSchema)



export default commentModel;