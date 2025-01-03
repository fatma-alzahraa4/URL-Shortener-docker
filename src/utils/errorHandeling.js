export const asyncHandler = (API)=>{
    return (req,res,next)=>{
        API(req,res,next).catch(async (err)=>{
            console.log(err);
            return res.status(err['cause']||500).json({message:err.message})
        })
    }
}
export const globalResponse = (err,req,res,next)=>{
    if(err){
        if(req.validationMessage){
            return res.status(err['cause']||400).json({message:req.validationMessage,err:'error from joi'})
        }
        return res.status(err['cause']||500).json({message:err.message})
    }
}