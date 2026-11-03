const mongoose = require("mongoose");
const showSchema = mongoose.Schema(
    {
        showTitle: String,
        showDescription: String,
        showGenre: String,
        showReleaseYear: Number,
        showLanguage: String,
        showTotalSeasons: Number,
        showTotalEpisodes: Number,
        showRating: Number,
        showPoster : String
    }
);

module.exports = mongoose.model("Show", showSchema);
