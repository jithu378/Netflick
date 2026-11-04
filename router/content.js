const express = require("express");
const router = express.Router();
const multer = require("multer");

const movieDetails = require("../models/movieModel");
const categoryDetails = require("../models/categoryModel");
const showDetails = require("../models/showModel");

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const file = multer({storage})

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
    res.render("add-show", {categories : categoryData})
})

router.get("/add-category", (req,res) => {
    res.render("add-category")
})

// form data
router.post("/add-movie-form",file.single("movie-poster"), async (req,res) => {
    
    const {title, description, genre, releaseYear, language, duration, rating} =req.body;
    const image = `/uploads/${req.file.filename}`;
    const movieData = await movieDetails.create({
        movieTitle : title,
        movieDescription : description,
        movieGenre : genre,
        movieReleaseYear : releaseYear,
        movieLanguage : language,
        movieDuration : duration,
        movieRating : rating,
        moviePoster : image
    })

    res.redirect("/content/admin")
})

router.post("/add-category-form", async (req, res) => {
    const {name} = req.body;
    const categoryData = await categoryDetails.create({
        categoryName : name
    })
    res.redirect("/content/admin")
})


router.post("/add-show-form", file.single("movie-poster"), async (req, res) => {
    const {title, description, genre, releaseYear, language, totalSeasons, totalEpisodes, rating} =req.body;
    const image = `/uploads/${req.file.filename}`;
    const showData = await showDetails.create({
        showTitle : title,
        showDescription : description,
        showGenre : genre,
        showReleaseYear : releaseYear,
        showLanguage : language,
        showTotalSeasons : totalSeasons,
        showTotalEpisodes : totalEpisodes,
        showRating : rating,
        showPoster : image
    })

    res.redirect("/content/admin")
})



module.exports = router;