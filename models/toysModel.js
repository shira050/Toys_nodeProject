const mongoose = require("mongoose");
const Joi = require("joi");

const toysSchema = new mongoose.Schema({
  name: String,
  cat: String,
  info: String,
  img_url: String,
  price: Number,
  user_id:String,
  date_created:{
    type:Date , default:Date.now()
  }
})

exports.ToyModel = mongoose.model("toys",toysSchema);

exports.validateToy = (_reqBody) => {
  let schemaJoi = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    info:Joi.string().min(2).max(200).allow(null," "),
    cat:Joi.string().min(2).max(99).required(),
    img_url:Joi.string().min(2).max(300).allow(null," "),
    price:Joi.number().min(0).max(999)
  })
  return schemaJoi.validate(_reqBody)
}
