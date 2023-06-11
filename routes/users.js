const express= require("express");
const bcrypt = require("bcrypt");

const {auth} = require("../middlewares/auth");
const {UserModel,validUser, validLogin, createToken} = require("../models/userModel")
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const router = express.Router();

router.get("/" , async(req,res)=> {
  let data = await UserModel.find({});
  res.json(data)
})



router.get("/myEmail", auth , async(req,res) => {
  try{
    let user = await UserModel.findOne({_id:req.tokenData._id},{email:1})
    res.json(user);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
} )

router.get("/myInfo", async(req,res) => {
 
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You need to send token to this endpoint url"})
  }
  try{
    let tokenData = jwt.verify(token, config.tokenSecret);
    let user = await UserModel.findOne({_id:tokenData._id},{password:0});
    res.json(user);

  }
  catch(err){
   return res.status(401).json({msg:"Token not valid or expired"})
  }
  
})

router.post("/", async(req,res) => {
  let validBody = validUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    user.password = "***";
    res.status(201).json(user);
  }
  catch(err){
    if(err.code == 11000){
      return res.status(500).json({msg:"Email already in system, try log in",code:11000})
       
    }
    console.log(err);
    res.status(500).json({msg:"err",err})
  }
})

router.post("/login", async(req,res) => {
  let validBody = validLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email})
    console.log(user);
    if(!user){
      return res.status(401).json({msg:"Password or email is worng ,code:1"})
    }
    let authPassword = await bcrypt.compare(req.body.password,user.password);
    if(!authPassword){
      return res.status(401).json({msg:"Password or email is worng ,code:2"});
    }
    let newToken = createToken(user._id);
    res.json({token:newToken});
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})
router.put("/:idEdit", async(req,res) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);

  let valdiateBody = validUser(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    let idEdit = req.params.idEdit
    let data = await UserModel.updateOne({_id:idEdit},req.body)
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.delete("/:idDel", async(req,res) => {
  try{
    let idDel = req.params.idDel
    let data = await UserModel.deleteOne({_id:idDel})
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})
module.exports = router;