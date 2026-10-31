const express = require("express");
const router = express.Router();

router.get("/add-movie", (req,res) => {
    res.render("add-movie")
})

module.exports = router;