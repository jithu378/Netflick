const express = require("express");
const router = express.Router();

const movieDetails = require("../models/movieModel");

router.get("/", async(req,res) => {
    const movieData = await movieDetails.find()
    res.render("index", {movies : movieData});
})

router.get("/admin", (req,res) => {
    res.render("admin");
})

module.exports=router;