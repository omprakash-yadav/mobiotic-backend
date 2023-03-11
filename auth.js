var bcrypt = require("bcryptjs");
var JWT=require("jsonwebtoken");
var JWTD=require("jwt-decode");
var secret="eirjnskj%$#@12344959"
var saltRound=10;

// incript the password
var hashPassword= async (pwd)=>{
    let salt = await bcrypt.genSalt(saltRound);
    let hash = await bcrypt.hash(pwd,salt);
    return hash

}
 //compare the password
 var hashCompare= async (pwd , hash)=>{
    let result=await bcrypt.compare(pwd,hash)
    return result
 }
 //creat token
 var createToken=async (firstName,lastName,email,mobile)=>{
    let token= await JWT.sign({
        firstName,
        lastName,
        email,
        mobile
    }
    ,secret,{
        expiresIn:"1m"//sesson expire time
    }
    )
    return token
 }
  //veryfy request
  let verifyToken = async (req, res, next) => {
    //console.log(req);
    let decodeData = JWTD(req.headers.token);
    if (new Date() / 1000 < decodeData.exp) {
      next();
    } else {
      res.json({
        statusCode: 401,
        message: "Tokken Expired",
      });
    }
  };
module.exports={hashPassword,hashCompare,createToken,verifyToken }