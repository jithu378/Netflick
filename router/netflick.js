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
router.get(["/viewMovie/:id", "/viewMovie"], async (req, res) => {
    try {
        const id = req.params.id || req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.render("viewMovie", { notFound: true, message: "Invalid Movie ID" });
        }

        const movie = await movieDetails.findById(id);
        if (!movie) {
            return res.render("viewMovie", { notFound: true, message: "Movie Not Found" });
        }

        const movieObj = movie.toObject ? movie.toObject() : movie;
        res.render("viewMovie", { movie: movieObj, ...movieObj });
    } catch (error) {
        console.error("Error retrieving movie details:", error);
        res.render("viewMovie", { notFound: true, message: "Error loading movie details" });
    }
});

// TV Show Details Route
router.get(["/viewShow/:id", "/viewShow"], async (req, res) => {
    try {
        const id = req.params.id || req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.render("viewShow", { notFound: true, message: "Invalid TV Show ID" });
        }

        const show = await showDetails.findById(id);
        if (!show) {
            return res.render("viewShow", { notFound: true, message: "TV Show Not Found" });
        }

        const showObj = show.toObject ? show.toObject() : show;
        res.render("viewShow", { show: showObj, ...showObj });
    } catch (error) {
        console.error("Error retrieving TV show details:", error);
        res.render("viewShow", { notFound: true, message: "Error loading TV show details" });
    }
});

module.exports=router;
