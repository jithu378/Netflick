const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const movieDetails = require("../models/movieModel");
const showDetails = require("../models/showModel");
const categoryDetails = require("../models/categoryModel");

router.get("/", async(req,res) => {
    const movieData = await movieDetails.find()
    res.render("index", {movies : movieData});
});


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

// Movie Details Route
router.get("/viewMovie/:id", async (req,res) => {
    const viewMovie = await movieDetails.findById(req.params.id);
    res.render("viewMovie", {viewMovie})
})

// TV Show Details Route
router.get("/viewShow/:id", async (req,res) => {
    const viewShow = await showDetails.findById(req.params.id);
    res.render("viewShow", {viewShow})
})


module.exports=router;
