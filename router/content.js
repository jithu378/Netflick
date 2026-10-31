const express = require("express");
const router = express.Router();

const movieDetails = require("../models/movieModel");
const categoryDetails = require("../models/categoryModel");
const showDetails = require("../models/showModel");

router.get("/add-movie", (req,res) => {
    res.render("add-movie")
})

router.get("/add-show", (req,res) => {
    res.render("add-show")
})

router.get("/add-category", (req,res) => {
    res.render("add-category")
})

// form data
router.post("/add-movie-form", async (req,res) => {
    const {title, description, genre, releaseYear, language, duration, rating} =req.body;
    const movieData = await movieDetails.create({
        movieTitle : title,
        movieDescription : description,
        movieGenre : genre,
        movieReleaseYear : releaseYear,
        movieLanguage : language,
        movieDuration : duration,
        movieRating : rating
    })

    res.redirect("/netflick/admin")
})

router.post("/add-category-form", async (req, res) => {
    const {name} = req.body;
    const categoryData = await categoryDetails.create({
        categoryName : name
    })

    res.redirect("/netflick/admin")
})

router.post("/add-show-form", async (req, res) => {
    const {title, description, genre, releaseYear, language, totalSeasons, totalEpisodes, rating} =req.body;
    const showData = await showDetails.create({
        showTitle : title,
        showDescription : description,
        showGenre : genre,
        showReleaseYear : releaseYear,
        showLanguage : language,
        showTotalSeasons : totalSeasons,
        showTotalEpisodes : totalEpisodes,
        showRating : rating
    })

    res.redirect("/netflick/admin")
})

module.exports = router;