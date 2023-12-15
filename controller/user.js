const jwt = require("jsonwebtoken");
const asynchandler =require("express-async-handler");
const bycrpt =require("bcryptjs");
const dotenv=require("dotenv").config({path:"config.env"})
const secret_key = process.env.secret_key;
const {usermodel, validateupdateprofile}=require("../models/User")
const path =require("path");
const {cloudinaryUploadImage,cloudinaryRemoveImage}=require("../utils/cloudinary")
const fs = require("fs");

const getalluser = (asynchandler(
    async (req,res)=>{

const users = await usermodel.find().select("-password").populate("post");

res.status(200).json(users);


    }

))




const getuser =(asynchandler(
    async (req,res)=>{
    const user = await usermodel.findById(req.params.id).select("-password").populate("post");
    if(!user){
        return res.status(404).json({msg:"User Not Found"});
    }
    res.status(200).json(user)


    }
))



const updateuserprofile =(asynchandler(
    async (req,res)=>{
const {error}=validateupdateprofile(req.body);
if(error){
    return res.status(400).json({msg:error.details[0].message})
}

if(req.body.password){
    const salt = await bycrpt.genSalt(6);
    req.body.password= await bycrpt.hash(req.body.password,salt)
}

const updateprofile = await usermodel.findByIdAndUpdate(req.params.id,{
    $set:{
        username:req.body.username,
        password:req.body.password,
        bio:req.body.bio
    }
},{new:true}).select("-password");

res.status(200).json(updateprofile)



    }
))





const getAllUserCount = asynchandler(
    async (req, res) => {
      const users = await usermodel.countDocuments();
      res.status(200).json(users);
    }
  );
  




const profilephotoupload =(asynchandler(
    async (req,res)=>{

        if(!req.file){
    
            return res.status(400).json({msg:"No File Provided"})
        }

const imagepath = path.join(__dirname,`../img/${req.file.filename}`)
const result = await cloudinaryUploadImage(imagepath);

const user = await usermodel.findById(req.user.id);
if(user.profilephoto.publicid !==null){
    await cloudinaryRemoveImage(user.profilephoto.publicid)
}

user.profilephoto={
    url:result.secure_url,
    publicid:result.public_id
}
await user.save();

        res.status(200).json({msg:"Your Profile Photo Uploaded Successfully",
        profilephoto:{url:result.secure_url,publicid:result.public_id}
        });
        
        fs.unlinkSync(imagepath)
    }
))






const deleteuser =(asynchandler(
    async (req,res)=>{


    const user = await usermodel.findById(req.params.id);
    if(!user){
        return res.status(400).json({msg:"User Not Found"})
    }

    await cloudinaryRemoveImage(user.profilephoto.publicid);
    await usermodel.findByIdAndDelete(req.params.id);

    res.status(200).json({msg:"Your Profile Has Been Deleted"})


    }
))




module.exports={
    deleteuser,profilephotoupload,getAllUserCount,updateuserprofile,getuser,getalluser,updateuserprofile
}