const express = require("express");
const router = express.Router();

router.get("/add-movie", (req,res) => {
    res.render("add-movie")
})

router.get("/add-show", (req,res) => {
    res.render("add-show")
})

router.get("/add-category", (req,res) => {
    res.render("add-category")
})

module.exports = router;