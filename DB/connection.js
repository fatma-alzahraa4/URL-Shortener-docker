import mongoose from "mongoose";
export const dbConnection = async ()=>{
    return await mongoose.
    connect(process.env.DB_CONNECTION)
    .then((res)=>{console.log("db connection success");})
    .catch((err)=>{console.log("db connection fail",err);})
}
