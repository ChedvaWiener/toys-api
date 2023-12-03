const mongoose = require('mongoose');
const { config } = require("../config/secret")

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.6ewyd65.mongodb.net/TOYS_DB`);
  console.log("mongo connected")
}

