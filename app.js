// YelpCamp app.js

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
        {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4080/4938516049_eef5cbc734.jpg"},
        {name: "Granite Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"}  ,  
        {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"}    
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    // get data from form and add campgrounds to array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Running");
});