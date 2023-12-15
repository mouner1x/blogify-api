const mongoose =require("mongoose");
const joi =require("joi");
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv").config({path:"config.env"})
const secret_key = process.env.secret_key;
const schema =mongoose.Schema;
const passwordcomplexity = require("joi-password-complexity")
const userschema = new schema({

username:{
    type:String,
    required:true,
    trim:true,
    minlength:2,
    maxlength:100
},
email:{
    type:String,
    required:true,
    trim:true,
    minlength:5,
    maxlength:100,
    unique:true
},
password:{
    type:String,
    required:true,
    trim:true,
    minlength:8,
},
profilephoto:{
    type:Object,
    default:{
        url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        publicid:null,
    }
},
isadmin:{
    type:Boolean,
    default:false
},
bio:{
    type:String,
},
isaccountverified:{
    type:Boolean,
    default:false
}

},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

userschema.virtual("post",{
    ref:"post",
    foreignField:"user",
    localField:"_id"
})



userschema.methods.generatetoken=function(){
    return jwt.sign({id:this._id,isadmin:this.isadmin},secret_key,{expiresIn:"1d"});
}

function validateregisteruser(obj){
    const schema = joi.object({
     username:joi.string().trim().min(2).max(100).required(),
     email:joi.string().trim().min(5).max(100).required().email(),
     password:passwordcomplexity().required(),
     confirmpassword:passwordcomplexity().valid(joi.ref("password")).required()
     

    })
    return schema.validate(obj)
}


function validateupdateprofile(obj){
    const schema = joi.object({
        username:joi.string().trim().min(2).max(100),
        password:passwordcomplexity(),
        bio:joi.string()
        
    })
    return schema.validate(obj);
}

function validateemail(obj){
    const schema = joi.object({
        email:joi.string().trim().min(5).max(100).required().email(),


    })
    return schema.validate(obj)
}

function validatenewpassword(obj){
    const schema = joi.object({

        password:passwordcomplexity().required(),

    })
    return schema.validate(obj)
}

function validateloginuser(obj){
    const schema =joi.object({

email:joi.string().trim().required().min(5).max(100),
password:joi.string().required().min(8).trim()


    })
    return schema.validate(obj)
}








const usermodel = mongoose.model("user",userschema)

module.exports={
    validatenewpassword,validateemail,usermodel,validateloginuser,validateregisteruser,validateupdateprofile
}