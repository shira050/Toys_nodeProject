const express= require("express");
const {auth} = require("../middlewares/auth");
const { ToyModel,validateToy } = require("../models/toysModel");
const router = express.Router();


router.get("/" , async(req,res)=> {
 
  let perPage = Math.min(req.query.perPage,10) || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try{
    let data = await ToyModel
    .find({})
    .limit(perPage)
    .skip((page - 1)*perPage)
    .sort({[sort]:reverse})
    res.json(data);
  } 
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }

})

router.get("/search", (req, res) => {
  let searchQ = req.query.s.toLowerCase();
  let temp_ar=ToyModel.find({});
   temp_ar = temp_ar.filter(item => {
      return item.name.toLowerCase().includes(searchQ) || item.info.toLowerCase().includes(searchQ)
  })
  res.json(temp_ar);
})



router.post("/", auth, async(req,res) => {
  let valdiateBody = validateToy(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    let toy = new ToyModel(req.body);
  
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy)
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.put("/:idEdit", async(req,res) => {
  let valdiateBody = validateToy(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    let idEdit = req.params.idEdit
    let data = await ToyModel.updateOne({_id:idEdit,user_id:req.tokenData._id},req.body)
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.delete("/:idDel",auth, async(req,res) => {
  try{
    let idDel = req.params.idDel
    let data = await ToyModel.deleteOne({_id:idDel,user_id:req.tokenData._id})
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})


router.get("/categories/:catName", (req, res) => {
  let catName =  req.params.catName;
  let temp_ar = ToyModel.find({}).filter(item => item.cat == catName)
  res.json(temp_ar);
})

router.get("/price/:min/:max",(req,res) => {
  
  let min = req.params.min;
  let max = req.params.max;
  let temp_ar = ToyModel.find({}).filter(item => {
    return (Number(item.price)>Number(min)&& Number(item.price)<Number(max))
  //   item.price>min &&
  })
  res.json(temp_ar);
})

router.get("/single/:id", (req, res) => {
  let id = req.params.id;
  let singleToy = ToyModel.findById(id);
  if (!singleToy) {
      return res.json({msg:"toy not found"})
  }
  res.json(singleToy)
})

module.exports = router;