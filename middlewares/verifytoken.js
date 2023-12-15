const jwt = require("jsonwebtoken");
const asynchandler =require("express-async-handler");
const bycrpt =require("bcryptjs");
const dotenv=require("dotenv").config({path:"config.env"})
const secret_key = process.env.secret_key;
const mongoose = require("mongoose");
const e = require("express");

function verifyid(req,res,next){
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({msg:"Invalid Id,Please Try again"})
    }
    else{
        next();
    }
}

function verifytoken(req,res,next){
    const authtoken =req.headers.token;
    if(!authtoken){
        return res.status(401).json({ msg: "No Token Provided, Please Login" });
    }

  try{
    const token = authtoken.split(" ")[1];
    const decoded =jwt.verify(token,secret_key)
    req.user=decoded;
    next()
  }
  catch(error){
    return res.status(401).json({msg:"Invalid Token,Access Denied"})
  }
}



function verifytokenandadmin(req,res,next){
    verifytoken(req,res,()=>{
        if(req.user.isadmin){
            next();
        }
        else{
            res.status(403).json("You Are Not Allowed To Do That")

        }
    })
}
function verifytokenandauth(req,res,next){
    verifytoken(req,res,()=>{
        if(req.user.id===req.params.id){
            next()
        }
        else{
            res.status(403).json("You Are Not Allowed To Do That")

        }
    })
}

function verifytokenandadminandauth(req,res,next){



    verifytoken(req,res,()=>{

        if(req.user.id===req.params.id || req.user.isadmin){
            next()
        }
        else{
            res.status(403).json("You Are Not Allowed To Do That")

        }
    })


}



module.exports={
    verifyid,verifytoken,verifytokenandadmin,verifytokenandauth,verifytokenandadminandauth
}