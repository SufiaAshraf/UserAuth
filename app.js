var express      = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    passport    = require('passport'),
	mongoose   = require("mongoose"),
	mongodb    = require("mongodb"),
    LocalStrategy = require("passport-local"),
    http = require('http'),
    User = require("./models/user");
    var flash      = require('connect-flash');
	var session      = require('express-session');
	// mongoose.connect("mongodb://localhost:27017/User_Auth", {useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false});
	mongoose.connection.on("open", function(ref) {
		console.log("Connected to mongo server.");
  	});
  
  mongoose.connection.on("error", function(err) {
	console.log("Could not connect to mongo server!");
	return console.log(err);
  });
  const URI = "mongodb+srv://<username>:<password>@cluster0-rx72y.mongodb.net/test?retryWrites=true&w=majority";
  const db = mongoose.connect(URI, { useNewUrlParser: true , useFindAndModify: false,  useUnifiedTopology: true  });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.json());
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "MJd just brags about himself.He's not a genius",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res , next){
	res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
	next();
});


// Setting Local Host
// const hostname = '127.0.0.1';
// const port = 3000;
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.end();
// });

// Landing page
app.get("/", function(req, res){
	res.render("landing");
});


// 	show register forms
app.get("/register", function(req, res){
	res.render("landing");
} );

// handle Sign Up
app.post("/register", function(req, res){
	var newUser= new User ({username: req.body.username});
	User.register(newUser , req.body.password , function(err , user){
		if(err){
			    req.flash("error" , "Username already exists");
            res.redirect("/");
            
		}	
		    passport.authenticate("local")(req, res, function(){
				req.flash("error" , "Welcome to the UserAuth " + user.username + "!! Log in to view the secret message!");
			res.redirect("/");
		});
	});
});
	
// show login form

app.get("/login" , function(req, res){
	res.render("landing");
});

// handle login logic
app.post("/login", passport.authenticate("local",
	{
	successRedirect: "/show", 
    failureRedirect: "/"
	}) , function(req , res){

});

// logout route
app.get("/logout" , function(req, res){
	req.logout();
	req.flash("error" , "LOGGED YOU OUT!!");
	res.redirect("/");
});

// logout show page
app.get("/show",isLoggedIn, function(req, res){
    res.render("show");
});

// middleware
function isLoggedIn(req , res , next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error" , "You need to be logged in to do that");
	res.redirect("/login");
}
// // Setting up port
// app.listen(port, hostname, () => {
// 	console.log(`Server running at http://${hostname}:${port}/`)
//   });
  


// Port
app.listen(process.env.PORT || 3000,
    () => console.log(`Server running`));
  


// mongoose.connect("mongodb+srv://UserAuth:UserAuth@cluster0-rx72y.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false});

// const connectDb = ()=>{
//      mongoose.connect(URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true ,
//         //  useFindAndModify: false
//         });
//     console.log('db connected');
// }



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://Sufia_Ashraf:iK14LV0iGLgsPiRL@cluster0-rx72y.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { 
// 	useNewUrlParser: true,
// 	// useFindAndModify: false, 
// 	useUnifiedTopology: true
// });
// client.connect(err => {
// 	console.log(err);
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
