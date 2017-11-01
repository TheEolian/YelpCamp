var express = require("express");
var router =express.Router();
var Campground = require("../models/campground");

// INDEX - show all campgrounds

router.get("/", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add new campground to database

router.post("/", function(req, res){
    // get data from form and add campgrounds to array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // Create new Campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground

router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground

router.get("/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;