const fs = require("fs");
const path = require("path");
const asynchandler =require("express-async-handler");
const {cloudinaryRemoveImage,cloudinaryUploadImage} =require("../utils/cloudinary")
const {validatecreatepost,validateupdatepost,postmodel} =require("../models/Post");





const createpost =(asynchandler(
    async (req,res)=>{
        if(!req.file){
    
            return res.status(400).json({msg:"No Image Provided"})

        }
        const {error} =validatecreatepost(req.body);
if(error){
    return res.status(400).json({msg:error.details[0].message})
}

const imagepath = path.join(__dirname,`../img/${req.file.filename}`)
const result = await cloudinaryUploadImage(imagepath)

const newpost = new postmodel({

    title:req.body.title,
    description:req.body.description,
    category:req.body.category,
    user:req.user.id,
    image:{
        url:result.secure_url,
        publicid:result.public_id
    }

})

await newpost.save();
res.status(201).json(newpost);
fs.unlinkSync(imagepath)

    }
))



const getallpost =(asynchandler(
    async (req,res)=>{

        const postperpage = 3;
        const {pagenumber,category}=req.query;
        let posts;
        if(pagenumber){
            posts=await postmodel.find()
            .skip((pagenumber-1)*postperpage)
            .limit(postperpage).sort({createdAt:-1}).
            populate("user",["-password"])
        }
        else if(category){
            posts=await postmodel.find({category:category}).sort({createdAt:-1}).populate("user",["-password"])
        }
        else{
            posts = await postmodel.find().sort({createdAt:-1}).populate("user",["-password"]);
        }

        res.status(200).json(posts);

    }
))



const getpost = (asynchandler(
    async (req,res)=>{
        const post = await postmodel.findById(req.params.id).populate("user",["-password"]).populate("comment");
        if(!post){
            return res.status(404).json({msg:"Post Not Found"});
        }
        res.status(200).json(post)
    }
))




const getpostcount =(asynchandler(
    async (req,res)=>{
        const postcount = await postmodel.countDocuments();
        res.status(200).json(postcount)
    }
))



const updatepost = (asynchandler(
    async (req, res) => {

        const { error } = validateupdatepost(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message })
        }
        const post = await postmodel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post Not Found" });
        }

        if (req.user.id !== post.user.toString()) {
            return res.status(400).json({msg:"You Are Not Allow Do That"})
        }
        const newpost =await postmodel.findByIdAndUpdate(req.params.id,{
            $set:{
                title:req.body.title,
                description:req.body.description,
                category:req.body.category
            }
        },{new:true}).populate("user",["-password"])

        res.status(200).json(newpost)

    }
))




const updateimage = (asynchandler(
    async (req, res) => {
        if(!req.file){
    
            return res.status(400).json({msg:"No Image Provided"})

        }
        const post = await postmodel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post Not Found" });
        }

        if (req.user.id !== post.user.toString()) {
            return res.status(400).json({msg:"You Are Not Allow Do That"})

        }
      
        await cloudinaryRemoveImage(post.image.publicid);
        
        const imagepath = path.join(__dirname,`../img/${req.file.filename}`)
 
        const result = await cloudinaryUploadImage(imagepath);
        const newpost =await postmodel.findByIdAndUpdate(req.params.id,{
            $set:{
               image:{
                url:result.secure_url,
                publicid:result.public_id
               }
            }
        },{new:true})

        res.status(200).json(updatepost);
        fs.unlinkSync(imagepath)

    }
))







const deletepost = (asynchandler(
    async (req,res)=>{
        const post = await postmodel.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post Not Found"})
            }
            if(req.user.isadmin || req.user.id === post.user.toString()){
                await postmodel.findByIdAndDelete(req.params.id)
                await cloudinaryRemoveImage(post.image.publicid)
                res.status(200).json({msg:"Post Has Been Deleted",postid:post._id})

            }
            else{
                res.status(403).json({msg:"Access Denied Forbidden"})
            }

    }
))




const togglelike =(asynchandler(
    async (req,res)=>{
        let post =await postmodel.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post Not Found"})
        }
        const ispostalreadylike = post.likes.find((user)=>user.toString() === req.user.id);
        if(ispostalreadylike){
            post = await postmodel.findByIdAndUpdate(req.params.id,{
                $pull:{
                    likes:req.user.id
                }
            },{new:true})
        }
        else{
            
                post = await postmodel.findByIdAndUpdate(req.params.id,{
                    $push:{
                        likes:req.user.id
                    }
                },{new:true})
            
        }
        res.status(200).json(post)
    }
))



module.exports={
    createpost,getallpost,updateimage,getpost,getpostcount,updatepost,deletepost,togglelike
}