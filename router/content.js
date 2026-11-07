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

//admin hashboard
router.get("/admin", async(req,res) => {
    const movieCount = await movieDetails.countDocuments();
    const showCount = await showDetails.countDocuments();
    const categoryCount = await categoryDetails.countDocuments();
    const totalContent = movieCount + showCount;
    res.render("admin",{movieCount, showCount, categoryCount, totalContent});
})

// manage page
router.get("/manage-movies", async (req, res) => {
    const movies = await movieDetails.find().sort({movieTitle: 1});
    res.render("manageMovies", {movies});
})

router.get("/manage-shows", async (req, res) => {
    const shows = await showDetails.find().sort({showTitle: 1});
    res.render("manageShows", {shows});
})

router.get("/manage-categories", async (req, res) => {
    const categories = await categoryDetails.find().sort({categoryName: 1});
    res.render("manageCategories", {categories});
})

// view page 
router.get("/view-movie/:id", async (req, res) => {
    try {
        const movie = await movieDetails.findById(req.params.id);
        res.render("viewManageMovie", {movie});
    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load movie details.");
    }
})

router.get("/view-show/:id", async (req, res) => {
    try {
        const show = await showDetails.findById(req.params.id);
        res.render("viewManageShow", {show});
    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load TV show details.");
    }
})

// add page
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


router.post("/add-show-form", file.single("posterImage"), async (req, res) => {
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

// delete request
router.post("/delete-movie/:id", async (req, res) => {
        try {
            await movieDetails.findByIdAndDelete(req.params.id);
            res.redirect("/content/admin");
        } catch (error) {
            console.log(error);
            res.redirect("/content/admin/");
        }
    });

router.post("/delete-show/:id", async (req, res) => {
        try {
            await showDetails.findByIdAndDelete(req.params.id);
            res.redirect("/content/admin");
        } catch (error) {
            console.log(error);
            res.redirect("/content/admin/");
        }
    });

router.post("/delete-category/:id", async (req, res) => {
        try {
            await categoryDetails.findByIdAndDelete(req.params.id);
            res.redirect("/content/admin");
        } catch (error) {
            console.log(error);
            res.redirect("/content/admin/");
        }
    });


// update page
router.get("/edit-movie/:id", async (req, res) =>{
    try{
        const movie = await movieDetails.findById(req.params.id);
        res.render("editMovie", {movie})
    } catch(error){
        console.log(error);
    }
})

router.get("/edit-show/:id", async (req, res) =>{
    try{
        const show = await showDetails.findById(req.params.id);
        res.render("editShow", {show})
    } catch(error){
        console.log(error);
    }
})

router.get("/edit-category/:id", async (req, res) =>{
    try{
        const category = await categoryDetails.findById(req.params.id);
        res.render("editCategory", {category})
    } catch(error){
        console.log(error);
    }
})


// update post

router.post("/update-movie/:id", file.single("movie-poster"), async(req, res) => {
    try{
        const {title, description, genre, releaseYear, language, duration, rating} =req.body;
        const data = {
            movieTitle : title,
            movieDescription : description,
            movieGenre : genre,
            movieReleaseYear : releaseYear,
            movieLanguage : language,
            movieDuration : duration,
            movieRating : rating
        };
        if(req.file){
            data.moviePoster = `/uploads/${req.file.filename}`;
        }
        const update = await movieDetails.findByIdAndUpdate(req.params.id, data, {returnDocument:"after"})
        res.redirect("/content/manage-movies")
    } catch(error){
        console.log(error);
        res.redirect("/netflick/")
    }
})

router.post("/update-show/:id", file.single("posterImage"), async(req, res) => {
    try{
        const {title, description, genre, releaseYear, language, totalSeasons, totalEpisodes, rating} =req.body;
        const data = {
            showTitle : title,
            showDescription : description,
            showGenre : genre,
            showReleaseYear : releaseYear,
            showLanguage : language,
            showTotalSeasons : totalSeasons,
            showTotalEpisodes : totalEpisodes,
            showRating : rating
        };
        if(req.file){
            data.showPoster = `/uploads/${req.file.filename}`;
        }
        const update = await showDetails.findByIdAndUpdate(req.params.id, data, {returnDocument:"after"})
        res.redirect("/content/manage-shows")
    } catch(error){
        console.log(error);
        res.redirect("/netflick/")
    }
})

router.post("/update-category/:id", async(req, res) => {
    try{
        const {name} =req.body;
        const data = {
            categoryName : name
        };
        const update = await categoryDetails.findByIdAndUpdate(req.params.id, data, {returnDocument:"after"})
        res.redirect("/content/manage-categories")
    } catch(error){
        console.log(error);
        res.redirect("/netflick/")
    }
})

module.exports = router;