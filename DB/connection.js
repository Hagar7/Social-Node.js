import mongoose from "mongoose"




export const connectionDB = async ()=>{
    return await mongoose
    .connect(process.env.DB_URL)
    .then((res)=> console.log("Db connection is running successfully"))
    .catch((err)=> console.console.log("Db connection failed"));
} 