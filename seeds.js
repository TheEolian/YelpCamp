var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");



// CAMPGROUNDS SEED DATA

var data = [
    {name: "Cloud's Rest", 
    image: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg",
    description: "Clouds Resting on Mountains"
    },
    {name: "Mountain's Edge", 
    image: "https://farm4.staticflickr.com/3659/3662521481_4a7bcce691.jpg",
    description: "Camp at the edge of a mountain with beautiful views!"
    },
    {name: "Solitude", 
    image: "https://farm8.staticflickr.com/7179/6927088769_cc14a7c68e.jpg",
    description: "Campipng in wide open space."
    },
    {name: "Setset Strip", 
    image: "https://farm6.staticflickr.com/5108/5789045796_27c9217bf2.jpg",
    description: "Beautiful Sunset view over the horizon."
    }
    ];



//REMOVE ALL CAMPGROUNDS

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
    });
// ADD CAMPGROUNDS  with loop
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }
                else {
                    console.log("Added a campground");
                    // CREATE COMMENT
                    Comment.create(
                        {
                            text: "This place is great but I wish there was internet!",
                            author: "Homer"
                        
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }
                            else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                            
                        });
                }
                
            });
        });
    
}


module.exports = seedDB;