const mongoose =require("mongoose");
const joi = require("joi")
const schmea = mongoose.Schema;
const commentschema = new schmea({

    postid:{
        type:mongoose.Types.ObjectId,
        ref:"post",
        required:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true,
    },
    text:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    }


},{timestamps:true})






const commentmodel = mongoose.model("comment",commentschema)

function validatecreatecomment(obj){
    const schema = joi.object({
        postid:joi.string().required(),
        text:joi.string().trim().required()

    })
    return schema.validate(obj)
}


function validateupdatecomment(obj){
    const schema = joi.object({
        text:joi.string().trim()

    })
    return schema.validate(obj)
}

module.exports={
    validatecreatecomment,validateupdatecomment,commentmodel
}