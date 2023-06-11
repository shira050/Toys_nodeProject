const mongoose = require("mongoose");
const { config } = require("../config/secret");

main().catch((err) => console.log(err));

async function main() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(
    // `mongodb+srv://${config.userDb}:${config.passDb}@cluster0.ppv5rvq.mongodb.net/`
    `mongodb+srv://shira:1234@cluster0.ppv5rvq.mongodb.net/toys_project`
  );
  console.log("mongo connect");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}