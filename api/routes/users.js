const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel, validUser } = require("../models/userModel")
const router = express.Router();


// Own info 
router.get("/myInfo", auth, async (req, res) => {
  try {
    let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0, toys: 0 });
    res.json(userInfo);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// Edit own info 
router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data;

    if (req.tokenData.role === "admin" || idEdit === req.tokenData._id) {
      data = await UserModel.updateOne({ _id: idEdit }, req.body)
    }

    if (!data) {
      return res.status(400).json({ err: "Unauthorized" })
    }
    let user = await UserModel.findOne({ _id: idEdit });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save()
    res.status(200).json({ msg: data })
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ err })
  }
})


// delete the user toys???
router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data;

    if (req.tokenData.role === "admin" || idDel === req.tokenData._id) {
      data = await UserModel.deleteOne({ _id: idDel });
    }

    if (!data) {
      return res.status(400).json({ err: "Unauthorized" })
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ err })
  }
})



module.exports = router;