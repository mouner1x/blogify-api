const mongoose =require("mongoose");
const joi = require("joi");

const shema = mongoose.Schema;
const categoryschema = new shema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true,
        },
        title:{
            type:String,
            required:true,
            trim:true
        }


},{timestamps:true})




const categorymodel = mongoose.model("category",categoryschema)


function validatecreatecategory(obj){
    const schema = joi.object({
        title:joi.string().trim().required()

    })
    return schema.validate(obj)
}

function validateupdatecategory(obj){
    const schema = joi.object({
        title:joi.string().trim()

    })
    return schema.validate(obj)
}

module.exports={
    validatecreatecategory,validateupdatecategory,categorymodel
}