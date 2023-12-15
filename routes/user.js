const express = require("express");
const { getalluser,getuser,deleteuser, updateuserprofile,getAllUserCount, profilephotoupload } = require("../controller/user");
const { verifytokenandadmin, verifyid,verifytokenandadminandauth, verifytokenandauth, verifytoken } = require("../middlewares/verifytoken");
const { photoupload } = require("../middlewares/photoupload");
const router = express.Router();



router.get("/profile",verifytokenandadmin,getalluser)
router.delete("/profile/:id",verifytokenandadminandauth,deleteuser)


router.get("/profile/:id",verifyid,getuser)

router.put("/profile/:id",verifyid,verifytokenandauth,updateuserprofile)


router.get("/count",verifytokenandadmin,getAllUserCount)
router.post("/profile/profile-photo-upload",verifytoken,photoupload.single("image"),profilephotoupload)


module.exports={
    userpath:router
}