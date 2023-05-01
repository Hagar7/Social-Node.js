import { connectionDB } from "../../DB/connection.js";
import * as allRouter from '../modules/index.routers.js'
import { stackVar } from "./errorHandling.js";




export const initateApp = (app,express)=>{
app.use(express.json());
app.use('/user',allRouter.userRouter)
app.use('/post',allRouter.postRouter)
app.use('/comment',allRouter.commentRouter)
app.all('*',(req,res)=>{
res.json({message:"not found"})
})


app.use((err,req,res,next)=>{
if(err){
  return  res.status(err['cause'] || 500).json({
    message:"fail response",
    Error:err.message,
    stack:stackVar
})
}
})

connectionDB()
app.listen(5000,()=>{
    console.log("listening on port 5000");
})

}