// YelpCamp app.js

var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    var campgrounds = [
        {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4080/4938516049_eef5cbc734.jpg"},
        {name: "Granite Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"}  ,  
        {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"}    
    ]
    
    res.render("campgrounds", {campgrounds: campgrounds});
    
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Running");
});