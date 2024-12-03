const express =require("express");
const mongo=require("mongoose");

const app = express();
mongo.connect("mongodb://localhost:27017/blogDB")
const userSchema={fullName:{Type:String,required:true},cin:{Type:String,required:true},
gender:{Type:String,enum:["M","F"],required:true},timeStamp:time};
const user =mongo.model("user",userSchema);
create user
updateuser by Id
delete user by id
get all usres
get user by id
delete all users