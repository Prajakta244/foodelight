var express = require("express")
var router = express.Router()
var passport = require("passport")
var Foodstop = require("../models/foodstop")
var User = require("../models/user")
var middleware = require("../middleware")

router.get("/" , function(req, res){
	res.render("landing")
})

router.get("/register",function(req,res){
	res.render("register")
})

router.post("/register",function(req,res){
	var newUser = new User({
		username:req.body.username,
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		email : req.body.email,
		profile : req.body.profile
	})
	if(req.body.secretKey = "expecto patronum"){
		newUser.isAdmin = true
	}
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err)
			req.flash("error", err.message)
			return res.redirect("/register")
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome To FooDelight "+  user.username)
			res.redirect("/foodstops")
		})
	})
})

router.get("/login",function(req,res){
	res.render("login")
})

router.post("/login", passport.authenticate("local",
		{
			successRedirect:"/foodstops",
			failureRedirect:"/login"	 
		}),function(req,res){
	
})

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You have been successfully logged out!")
	res.redirect("/foodstops")
})

router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, userprofile){
		if(err){
			console.log(err.message)
			req.flash("error","something went wrong.....")
			return res.redirect("/")
		}
		Foodstop.find().where("author.id").equals(userprofile._id).exec(function(err, foodstop){
			if(err){
				console.log(err.message)
			req.flash("error","something went wrong.....")
			 return res.redirect("/")
		}
			res.render("user/show" , {user : userprofile , foodstop : foodstop})
		})
	})
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	
	res.redirect("/login")
}

module.exports = router