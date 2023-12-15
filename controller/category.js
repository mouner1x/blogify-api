const asynchandler =require("express-async-handler");
const {validatecreatecategory,validateupdatecategory,categorymodel} =require("../models/Category")






const createcategory = (asynchandler(
    async (req,res)=>{
        const {error} =validatecreatecategory(req.body)
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }
        const Category = await categorymodel.create({
            title:req.body.title,
            user:req.user.id
        })
        res.status(201).json(Category)
    }
))



const getallcategory =(asynchandler(
    async (req,res)=>{

        const category = await categorymodel.find();
        res.status(200).json(category)
    }
))


const deletecategory = (asynchandler(
    async (req,res)=>{
        const category = await categorymodel.findById(req.params.id);
        if(!category){
            return res.status(404).json({msg:"CAtegory Not Found"})
        }

        await categorymodel.findByIdAndDelete(req.params.id)
        res.status(200).json({msg:"category has been deleted",
        categoryid:category._id

        })
    }
))

module.exports={
    createcategory,getallcategory,deletecategory
}