const jwt = require("jsonwebtoken");
const asynchandler =require("express-async-handler");
const bycrpt =require("bcryptjs");
const dotenv=require("dotenv").config({path:"config.env"})
const secret_key = process.env.secret_key;
const {validateloginuser,validateregisteruser,validateemail,validatenewpassword,usermodel}=require("../models/User");
const {verifytoken } = require("../middlewares/verifytoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendemail");
const { verifytokenmodel } = require("../models/verfifytoken");
const { error } = require("console");






const registeruser = (asynchandler(
    async (req,res)=>{

    const {error} = validateregisteruser(req.body);
    if(error){
        return res.status(400).json({msg:error.details[0].message});        

    }

    const user = await usermodel.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({msg:"User Already Exist"})
    }

const salt = await bycrpt.genSalt(6);
req.body.password = await bycrpt.hash(req.body.password,salt);



const newuser = await new usermodel({
username:req.body.username,
email:req.body.email,
password:req.body.password
})

await newuser.save();

const verifytoken = await new verifytokenmodel({
    user:newuser._id,
    token:crypto.randomBytes(32).toString("hex")
})
await verifytoken.save();
const link = `http://localhost:8080/api/auth/user/${newuser._id}/verify/${verifytoken.token}`;
const htmltemplat = `
Click the link to verify your email: ${link} 

`
await sendEmail(newuser.email,"verify your email",htmltemplat)

res.status(201).json({msg:"we sent to you an email,please verify your email address"})
    }
))














const verifyuseraccount =(asynchandler(
    async (req,res)=>{
        const user = await usermodel.findById(req.params.id);
        if(!user){
            return res.status(400).json({msg:"invaild link"})
        }
        const verifyaccount = await verifytokenmodel.findOne({
           
            token:req.params.token,
            user:user._id,


        })

        if(!verifyaccount){
            return res.status(400).json({msg:"invaild link"})
        }

        user.isaccountverified = true;
        await user.save();
        await verifyaccount.deleteOne()

         res.status(200).json({ msg: "Account verified successfully" });

    }
))












const loginuser = (asynchandler(
    async (req,res)=>{

const {error} =validateloginuser(req.body);
if(error){
    return res.status(400).json({msg:error.details[0].message});        

}
const user = await usermodel.findOne({email:req.body.email});
if(!user){
    return res.status(401).json({msg:"Incorrect Password Or Email"});
}

const passwordmatch = await bycrpt.compare(req.body.password,user.password);
if(!passwordmatch){
    return res.status(401).json({msg:"Incorrect Password Or Email"});
}


if(!user.isaccountverified){
    let verfifytoken = await verifytokenmodel.findOne({
        user:user._id
    })
    if(!verfifytoken){
        verfifytoken = new verifytokenmodel({
            user:user._id,
            token:crypto.randomBytes(32).toString("hex")
        })
        await verfifytoken.save();
    }

    const link = `http://localhost:8080/api/auth/user/${user._id}/verify/${verfifytoken.token}`;
const htmltemplat = `
Click the link to verify your email: ${link} 

`
await sendEmail(user.email,"verify your email",htmltemplat)
return res.status(400).json({msg:"please active your account,we sent to you an email"})

}

const token = user.generatetoken();
res.status(200).json({
    _id:user._id,
    isadmin:user.isadmin,
    profilephoto:user.profilephoto,
    token
})


    }
))




const forgetpassword = (asynchandler(
    async (req,res)=>{

        const {error} = validateemail(req.body);
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }
        const {email} = req.body
        const user = await usermodel.findOne({email})
        if(!user){
            return res.status(404).json({msg:"user not found"})
        }

        let verifytoken = await verifytokenmodel.findOne({
            user:user._id
        })
        if(!verifytoken){
            verifytoken = new verifytokenmodel({
                user:user._id,
                token:crypto.randomBytes(32).toString("hex")
            }) 
        }
        const link = `http://localhost:8080/${user._id}/${verifytoken.token}`
        const htmltemplat = `click the link to rest password ${link}`;
        await sendEmail(user.email,"Rest Password",htmltemplat);
        res.status(200).json({msg:"we sent message to email"})
    }
))


const verifyuser = (asynchandler(
    async (req,res)=>{

        const user = await usermodel.findById(req.params.id);
        if(!user){
            return res.status(400).json({msg:"User Not Found"})
        }
        const verifytoken = await verifytokenmodel.findOne({
            user:user_id,
            token:req.params.token
        })
        if(!verifytoken){
            return res.status(400).json({msg:"invalid link"})
        }
        res.status(200).json({msg:"vaild url"})
    }
))






const resetpassword = (asynchandler(
    async (req,res)=>{

        const {error} = validatenewpassword(req.body)
        if(error){
            return res.status(400).json({msg:error.details[0].message})
        }

        const user = await usermodel.findById(req.params.id);
        if(!user){
            return res.status(400).json({msg:"invalid link"});
        }
        const verifytoken = await verifytokenmodel.findOne({
            user:user._id,
            token:req.params.token
        });

        if(!user.isaccountverified){
            user.isaccountverified = true;
        }
        const slat =await bycrpt.genSalt(6);
        req.body.password = await bycrpt.hash(req.body.password,salt)
        user.password = req.body.password;
        await user.save();
        await verifytoken.deleteOne();
        res.status(200).json({msg:"Password Reset Succsecfully"})


    }
))


module.exports={
    resetpassword,verifyuser,registeruser,loginuser,verifyuseraccount,forgetpassword
}