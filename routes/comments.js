var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments NEW

router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else {
            // the value of the first "campground"
            // is equal to the 2nd value campground which is the 
            // campground found from the find by id above
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments CREATE

router.post("/", isLoggedIn, function(req, res){
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else {
                    // Add Username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    // push comment to campground
                    campground.comments.push(comment);
                    // save campground
                    campground.save(); 
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// comments EDIT route    /campgrounds/:id/edit

router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// comments UPDATE route
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// comments DESTROY ROUTE  /campgrounds/:id/comments/:comment_id
router.delete("/:comment_id", function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// MIDDLEWARE

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;