const indexR = require("./index");
const usersR = require("./users");
const toysR = require("./toys");
const adminR = require("./admin")
const userAuthR = require("./userAuth")

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/toys", toysR)
  app.use("/admin", adminR)
  app.use("/user", userAuthR)
}