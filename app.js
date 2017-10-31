var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User    = require("./models/user"),
    seedDB     = require("./seeds");
    
app.use(express.static(__dirname + "/public"));
    
    
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// LANDING

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - show all campgrounds

app.get("/campgrounds", function(req, res){
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

app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

//=================
// COMMENTS ROUTES
//=================

app.get("/campgrounds/:id/comments/new", function(req, res){
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

app.post("/campgrounds/:id/comments", function(req, res){
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
    // create new comment
    // connect new comment to campground
    // redirect to campground show page
});

//=======================
//  AUTHORIZATION ROUTES
//=======================

// SHOW REGISTER FORM
// when the request is /register, respond by rendering register.ejs
app.get("/register", function(req, res){
    res.render("register");
});

// SIGN UP LOGIC

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       } 
       passport.authenticate("local")(req, res, function(){
          res.redirect("/campgrounds"); 
       });
    });
});

// SHOW LOGIN FORM

app.get("/login", function(req, res){
    res.render("login");
});

// HANDLE LOGIN LOGIC

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Running");
});