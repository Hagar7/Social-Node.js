import { Schema, model } from "mongoose";



const postSchema = new Schema({

title:String,
desc:String,
likes:[{
type:Schema.Types.ObjectId,
ref:'User'
}],
createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
comments:[{
  type:Schema.Types.ObjectId,
    ref:'Comment'
}]

},{
  timestamps:true  
})



const postModel = model.Post || model('Post',postSchema)



export default postModel;