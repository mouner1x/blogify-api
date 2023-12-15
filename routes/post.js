const express =require("express");
const router = express.Router();
const {photoupload} =require("../middlewares/photoupload")
const { createpost,getallpost,updatepost,deletepost,togglelike, getpost, getpostcount, updateimage}=require("../controller/post")
const {verifytokenandadminandauth,verifytokenandauth,verifytoken,verifyid, verifytokenandadmin} =require("../middlewares/verifytoken")



router.post("/",verifytoken,photoupload.single("image"),createpost)
router.get("/",getallpost)
router.get("/count",getpostcount)
router.get("/:id",verifyid,getpost)
router.put("/like/:id",verifyid,verifytoken,togglelike)
router.put("/:id",verifyid,verifytoken,updatepost)
router.put("/upload-image/:id",verifyid,verifytoken,photoupload.single("image"),updateimage)

router.delete("/:id",verifytoken,deletepost)


module.exports={
    postpath:router
}