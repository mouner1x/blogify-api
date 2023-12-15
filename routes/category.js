const express =require("express");
const router = express.Router();
const {verifyid,verifytoken,verifytokenandadmin,verifytokenandadminandauthv,v } =require("../middlewares/verifytoken")

const {createcategory,deletecategory, getallcategory} =require("../controller/category")


router.post("/",verifytokenandadmin,createcategory)

router.get("/",getallcategory)



router.delete("/:id",verifyid,verifytokenandadmin,deletecategory)


module.exports={
    categorypath:router
}