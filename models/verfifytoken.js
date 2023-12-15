const mongoose =require("mongoose");
const schmea = mongoose.Schema;

const verifytokenschema = new schmea({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
},{timestamps:true})



const verifytokenmodel = mongoose.model("verifytoken",verifytokenschema)

module.exports={
    verifytokenmodel
}

