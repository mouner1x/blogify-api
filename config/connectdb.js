const monogoose =require("mongoose");
const dotenv =require("dotenv").config({path:"config.env"})
const db_url=process.env.db_url;
const connnectdb =()=>{

monogoose.connect(db_url).then(()=>{
    console.log("Database Connected !!")
}).catch((e)=>{
    console.log(e)
})

}



module.exports={
    connnectdb
}