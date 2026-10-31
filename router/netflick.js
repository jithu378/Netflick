const express = require("express");
const router = express.Router();

const movieDetails = require("../models/movieModel");
const showDetails = require("../models/showModel");
const categoryDetails = require("../models/categoryModel");

router.get("/", async(req,res) => {
    const movieData = await movieDetails.find()
    res.render("index", {movies : movieData});
});

router.get("/admin", async(req,res) => {
    const movieCount = await movieDetails.countDocuments();
    const showCount = await showDetails.countDocuments();
    const categoryCount = await categoryDetails.countDocuments();
    const totalContent = movieCount + showCount;
    res.render("admin",{movieCount, showCount, categoryCount, totalContent});
})

router.get("/displayMovies", async (req,res) => {
    const movieData = await movieDetails.find();
    res.render("displayMovies", {movies : movieData});
})

router.get("/displayShows",async (req,res) => {
    const showData = await showDetails.find();
    res.render("displayShows", {shows : showData});
})

router.get("/displayCategories", async (req,res) => {
    const categoryData = await categoryDetails.find();
    res.render("displayCategories", {categories : categoryData});
})

router.get("/displayMyList", (req,res) => {
    res.render("displayMyList");
})

module.exports=router;