const mongoose = require("mongoose");
const movieSchema = mongoose.Schema(
    {
        movieTitle : String,
        movieDescription : String,
        movieGenre : String,
        movieReleaseYear : Number,
        movieLanguage : String,
        movieDuration : Number,
        movieRating : Number
    }
);

module.exports = mongoose.model("Movie", movieSchema);