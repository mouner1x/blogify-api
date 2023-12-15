const mongoose =require("mongoose");
const joi =require("joi");
const jwt = require("jsonwebtoken");
const schema = mongoose.Schema;
const postschema = new schema({

title:{
    type:String,
    required:true,
    trim:true,
    minlength:2,
    maxlength:200
},
description:{
    type:String,
    required:true,
    trim:true,
    minlength:10,
},
user:{
    type:mongoose.Types.ObjectId,
    required:true,
    ref:"user"
},
category:{
    type:String,
    required:true,
},
image:{
    type:Object,
    default:{
        url:"",
        publicid:null
    }
    },
    likes:[
        {
            type:mongoose.Types.ObjectId,
            ref:"user"
        }
    ]


},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

postschema.virtual("comment",{
    ref:"comment",
    foreignField:"postid",
    localField:"_id"
})
const postmodel = mongoose.model("post",postschema);



function validatecreatepost(obj){
    const schema = joi.object({

        title:joi.string().trim().min(2).max(200).required(),
        description:joi.string().trim().min(10).required(),
        category:joi.string().trim().required()
    })
    return schema.validate(obj)
}


function validateupdatepost(obj){
    const schema = joi.object({

        title:joi.string().trim().min(2).max(200),
        description:joi.string().trim().min(10),
        category:joi.string().trim()
    })
    return schema.validate(obj)
}





module.exports={
    postmodel,validatecreatepost,validateupdatepost
}