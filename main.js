const express =require("express");
const app = express();
const dotenv =require("dotenv");
dotenv.config({path:"config.env"})
const port = process.env.port || 8080;
const morgan =require("morgan");
const { connnectdb } = require("./config/connectdb");
const {authpath}=require("./routes/auth")
const {userpath}=require("./routes/user");
const { postpath } = require("./routes/post");
const { commentpath } = require("./routes/comment");
const { categorypath } = require("./routes/category");
const { errorhandel ,notfoundapiroute} = require("./middlewares/errorhandel");
const xss = require("xss-clean")
const ratelimit = require("express-rate-limit")
const hpp = require("hpp")
const helmet = require("helmet")



//connec db
connnectdb();
 //middleware 
 app.use(express.urlencoded({extended:true}))
 app.use(express.json());
 app.use(morgan("dev"));

 //security headers

 app.use(helmet())





 //The user will not enter any script code such as JavaScript or etc.. 
app.use(xss());



//It specifies that the user only sends specific requests at a specific time
app.use(ratelimit({
    windowMs : 10*60*1000, //10 min
    max:200
}))


//prevent http param pollution

app.use(hpp())


//routes
 app.use("/api/post",postpath)
app.use("/api/user/",userpath)
app.use("/api/auth/",authpath)
app.use("/api/comment",commentpath)
app.use("/api/category",categorypath)








app.use(notfoundapiroute)
app.use(errorhandel)










app.listen(port,()=>{
    console.log(`server is runing on port ${port}`)
})




