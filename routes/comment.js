const express = require("express");
const router = express.Router();
const { createcomment,getallcomment, deletecomment, updatecomment } =require("../controller/comment");
const { verifytoken, verifyid,verifytokenandadmin } = require("../middlewares/verifytoken");

router.post("/",verifytoken,createcomment);
router.get("/",verifytokenandadmin,getallcomment);
router.put("/:id",verifyid,verifytoken,updatecomment);

router.delete("/:id",verifyid,verifytoken,deletecomment);






module.exports={
    commentpath:router
}