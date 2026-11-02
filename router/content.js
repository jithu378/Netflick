const express = require("express");
const router = express.Router();

const movieDetails = require("../models/movieModel");
const categoryDetails = require("../models/categoryModel");
const showDetails = require("../models/showModel");

router.get("/admin", async(req,res) => {
    const movieCount = await movieDetails.countDocuments();
    const showCount = await showDetails.countDocuments();
    const categoryCount = await categoryDetails.countDocuments();
    const totalContent = movieCount + showCount;
    res.render("admin",{movieCount, showCount, categoryCount, totalContent});
})

router.get("/add-movie",async (req,res) => {
    const categoryData = await categoryDetails.find()
    res.render("add-movie", {categories : categoryData})
})

router.get("/add-show", async (req,res) => {
    const categoryData = await categoryDetails.find()
    console.log(categoryData)
    res.render("add-show", {categories : categoryData})
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