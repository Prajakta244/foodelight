var express = require("express")
var multer = require("multer")
var router = express.Router()
var path = require("path")
var passport = require("passport")
var Foodstop = require("../models/foodstop")
var User = require("../models/user")
var middleware = require("../middleware")

var storage = multer.diskStorage({
  destination: function(req,file,cb){
	  cb(null,"./public/upload/")
  }
	,
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})
var upload = multer({ storage:storage }).single("profile") 

router.get("/" , function(req, res){
	res.render("landing")
})

router.get("/register",function(req,res){
	res.render("register")
})

// router.get("/users/upload",function(req,res,next){
// 		res.render("register")
// })

router.post("/register",upload,function(req,res){
	console.log("body: "+JSON.stringify(req.body))
	console.log(req.body.username)
	
	var newUser = new User({
		username:req.body.username,
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		email : req.body.email,
		profile : req.file.originalname
	})
	if(req.body.secretKey = "expecto patronum"){
		newUser.isAdmin = true
	}
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err)
			req.flash("error", err.message)
			res.redirect("/register")
		}
		// console.log(req.file)
		console.log("file: "+req.file.originalname)
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome To FooDelight "+  user.username)
			res.redirect("/foodstops")
		})
	})
})



router.get("/login",function(req,res){
	res.render("login")
})



router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/foodstops",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome to FooDelight, " + req.body.username + "!"
    })(req, res);
});

// router.get("/logout",function(req,res){
// 	req.logout();
// 	req.flash("success","You have been successfully logged out!")
// 	res.redirect("/foodstops"),
// })

router.get("/auth/google",passport.authenticate('google',{
	scope:['profile']
}))

router.get("/auth/google/redirect",passport.authorize('google', {
                successRedirect : '/foodstops',
                failureRedirect : '/'
            }))

var authCheck = (req,res,next)=>{
	if(!req.user){
	   res.redirect("/auth/login")
	   }
	   else{
		   next()
	   }
}

router.get('/profile',authCheck,(req,res)=>{
	res.redirect('/foodstops')
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
			console.log("USERPROFILE "+ userprofile._id)
			// console.log(foodstop[0].author)
			res.render("user/show" , {user : userprofile , foodstop : foodstop})
		})
	})
})

router.get("/category",function(req,res,next){
	var cate = req.query.category;
	if(!cate){
		res.render("categories")
		return next()
	}
	Foodstop.find().where("category").equals(cate).exec(function(err, foodstop){
			if(err){
				console.log(err.message)
			req.flash("error","something went wrong.....")
			 return res.redirect("/")
		}
		console.log(foodstop)
			res.render("category_items" , {foodstop : foodstop})
		})
	
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	
	res.redirect("/login")
}

module.exports = router