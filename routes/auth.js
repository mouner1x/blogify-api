const express = require("express");
const { resetpassword,registeruser,verifyuseraccount, verifyuser,forgetpassword,loginuser } = require("../controller/auth");
const router = express.Router();






router.post("/login",loginuser)
router.post("/register",registeruser)
router.post("/forget-password",forgetpassword)
router.get("/reset-password/:id/:token",verifyuser)
router.post("/reset-password",resetpassword)

router.get("/:id/verify/:token",verifyuseraccount)



module.exports={
    authpath:router
}