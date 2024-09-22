const { errorOut } = require("firebase-tools/lib/errorOut");
const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://kukutlapallyrishith20:sunny2233@cluster0.yrwof.mongodb.net/")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log(e);
})

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const LogInCollection=new mongoose.model('login',logInSchema)

module.exports=LogInCollection