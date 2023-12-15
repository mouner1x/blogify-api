const asynchandler =require("express-async-handler");
const {validatecreatecomment,validateupdatecomment,commentmodel} =require("../models/Comment")
const {usermodel} =require("../models/User");
const { postmodel } = require("../models/Post");




const createcomment = (asynchandler(
    async (req,res)=>{

        const {error} =validatecreatecomment(req.body);
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }
        
        const profile = await usermodel.findById(req.user.id);
 
        const comment = await new commentmodel({
            postid: req.body.postid,
            text: req.body.text,
            user: req.user.id,
            username: profile.username

        })
        await comment.save();
        res.status(201).json(comment)


    }
))



const getallcomment =(asynchandler(
    async (req,res)=>{

        const comments = await commentmodel.find().populate("user"); 
        res.status(200).json(comments)
    }

))




const deletecomment =(asynchandler(
    async (req,res)=>{
        const comment = await commentmodel.findById(req.params.id);
        if(!comment){
            return res.status(404).json({msg:"comment not found"})
        }

        if(req.user.isadmin || req.user.id===comment.user.toString()){
            await commentmodel.findByIdAndDelete(req.params.id)
            res.status(200).json({msg:"comment has been deleted"})
        }
        else{
            res.status(403).json({msg:"you not allowed do that "})
        }

    }
))



const updatecomment =(asynchandler(
    async (req,res)=>{
        const {error} =validateupdatecomment(req.body);
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }
        const comment = await postmodel.findById(req.params.id);
        if(!comment){
            return res.status(404).json({msg:"Comment Not Found"});
        }

        if(req.user.id!==comment.user.toString()){
            return res.status(403).json({msg:"Access Denied,only user himself can edit this comment"})
        }
        const updatedcomment = await commentmodel.findByIdAndUpdate(req.params.id,{
            $set:{
                text:req.body.text
            }
        },{new:true})
        res.status(200).json(updatedcomment)
    }
))








module.exports={
    createcomment,getallcomment,deletecomment,updatecomment
}