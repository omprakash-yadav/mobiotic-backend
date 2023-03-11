var express = require('express');

var router = express.Router();
var { mongodb,MongoClient,dbUrl}=require('../dbschema');
var {hashPassword, hashCompare,createToken,verifyToken}=require("../auth");

// signup
router.post('/signup', async(req, res) =>{
  const client=await MongoClient.connect(dbUrl)
 try {
  let db=await client.db("mobiotic")
  let user=await db.collection("users").findOne({email:req.body.email})
  //console.log(user)
  if(user)
  {
    res.json({
      statusCode:400,
      message:"User Alredy Exist"
    })

  }
  else{
    let  hashdPassword =await hashPassword(req.body.password);
    req.body.password=hashdPassword
    //console.log(req.body)
    let user=await db.collection("users").insertOne(req.body)
    res.json({
      
       statusCode:200,
       message:"user signup successfull"
    })
  }
  
 } catch (error) {
  res.json({
    statusCode:500,
    message:"Internal server Error"
  })
  
 }
 finally{
  client.close()
 }
});

 //login
router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let db = await client.db("mobiotic");
    let user = await db.collection("users").findOne({ email: req.body.email });
    //console.log(req.body)
    if (user) {
      let compare = await hashCompare(req.body.password, user.password);
      if (compare) {
        let token=await createToken(user.firstName,user.email,user.mobile)
        res.json({
          statusCode: 200,
          firstName: user.firstName,
          email: user.email,
          mobile:user.mobile,
          token
          
        });
      } else {
        res.json({
          statusCode: 400,
          message: "Invalid Password",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "User Not Found",
      });
    }
  } catch (error) {
    //console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  } finally {
    client.close();
  }
});

//verify token
router.post("/auth", verifyToken,  async (req, res) => {
  
  res.json({
    statusCode: 200,
    message: req.body.purpose,
  });
});

module.exports = router;
