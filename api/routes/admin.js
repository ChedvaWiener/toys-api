const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { UserModel } = require("../models/userModel");

const router = express.Router();

router.get("/usersList", authAdmin, async (req, res) => {
    try {
        let data = await UserModel.find({}, { password: 0 });
        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;
