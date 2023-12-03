const express = require("express");
const { auth } = require("../middlewares/auth");
const { ToyModel } = require("../models/toyModel");
const { UserModel } = require("../models/userModel");
const { validateToy } = require("../validation/toyValidation");

const router = express.Router();

// Get all toys
router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;

    try {
        const data = await ToyModel.find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ name: -1 })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There was an error, please try again later", err });
    }
})



// Get all the toys in spesific category
router.get("/category/:categoryName", async (req, res) => {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;

    try {
        const categoryReg = new RegExp(req.params.categoryName, "i")
        const data = await ToyModel.find({ category: categoryReg })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ name: -1 })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There is an error, come back later", err })
    }
})

// Get toy by name or info
router.get("/search", async (req, res) => {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;

    try {
        const queryS = req.query.s || " ";
        const searchReg = new RegExp(queryS, "i");

        let data = await ToyModel.find({
            $or: [
                { name: { $regex: searchReg } },
                { info: { $regex: searchReg } }
            ]
        })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ name: 1 })
        res.json(data);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There was an error, please try again later", err });
    }
});


// Get all the toys by produced country
router.get("/producedCountry/:countryName", async (req, res) => {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort || "produced_country"
    const reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        const countryReg = new RegExp(req.params.countryName, "i")
        const data = await ToyModel.find({ produced_country: countryReg })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There was an error, please try again later", err });
    }
})


// Get  toys by min and  max price
router.get("/prices", async (req, res) => {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;

    try {
        const minPrice = req.query.minPrice || 0;
        const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER;

        const data = await ToyModel.find({
            price: { $gte: minPrice, $lte: maxPrice }
        })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ price: 1 })
        res.json(data);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There was an error, please try again later", err });
    }
})


// Add a toy
router.post("/", auth, async (req, res) => {
    const validBody = validateToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        const toy = new ToyModel(req.body);
        const user_id = req.tokenData._id;
        await toy.save();

        await UserModel.findByIdAndUpdate(
            user_id,
            { $push: { toys: toy._id } },
            { new: true }
        );

        res.status(201).json(toy);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There was an error, please try again later", err });
    }
})


// Edit a toy
router.put("/:toyId", auth, async (req, res) => {
    const validBody = validateToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        const toyId = req.params.toyId;
        const userId = req.tokenData._id;

        if (!(req.tokenData.role == "admin" || (await belongToUser(userId, toyId)))) {
            return res.status(403).json({ msg: "Permission denied" });
        }

        const updatedToy = await ToyModel.findByIdAndUpdate(
            toyId,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedToy);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There was an error, please try again later", err });
    }
})



// Delete a toy
router.delete("/:toyId", auth, async (req, res) => {
    try {
        const toyId = req.params.toyId;
        const userId = req.tokenData._id;

        if (!(req.tokenData.role === "admin" || (await belongToUser(userId, toyId)))) {
            return res.status(403).json({ msg: "Permission denied" });
        }

        await ToyModel.findByIdAndDelete(toyId);
        await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { toys: toyId } },
            { new: true }
        );

        res.json({ msg: "Toy deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "There was an error, please try again later", err });
    }
});


// Get a toy by _id
router.get("/single/:toyId", async (req, res) => {
    const toyId = req.params.toyId;

    try {
        let toyData = await ToyModel.findOne({ _id: toyId });
        res.json(toyData);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;


// Check if the user has access to the toy
const belongToUser = async (userId, toyId) => {
    try {
        const user = await UserModel.findById(userId).exec();

        if (!user) {
            return false;
        }

        return user.toys.includes(toyId);
    } catch (error) {
        console.error(error);
        return false;
    }
}