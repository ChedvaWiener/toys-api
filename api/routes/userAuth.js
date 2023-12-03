const express = require("express");
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const { createToken } = require("../helpers/token");
const { validUser, validLogin } = require("../validation/userValidation");

const router = express.Router();

// Sign up
router.post("/", async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);

        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "******";
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already exists, log in", code: 11000 })

        }
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})



// Login
router.post("/login", async (req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ msg: "Password and email mismatch." })
        }
        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password and email mismatch." });
        }
        let token = createToken(user._id, user.role);
        res.json({ token });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;