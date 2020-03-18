var express = require("express")
var router = express.Router({mergeParams:true})
var Foodstop = require("../models/foodstop")
var middleware = require("../middleware")

//SHOW all foodstops
router.get("/", function(req,res){
	console.log(req.user)
	console.log(res.locals.currentUser)
	Foodstop.find({},function(err,allFoodstops){
		if(err){
			console.log(err)
		}
		else{
			res.render("foodstops/foodstops", {foodstops:allFoodstops})		
		}
	})
	
})

//CREATE new foodstop
router.post("/", middleware.isLoggedIn, function(req,res){
	var name  = req.body.name
	var image = req.body.image
	var secondimage = req.body.secondimage
	var thirdimage = req.body.thirdimage
	var desc  = req.body.description
	var author = {
		id:req.user._id,
		username : req.user.username
	}
	var price = req.body.price
	var address = req.body.address
	var category = req.body.category	
	var location = req.body.location
	var newfoodstop = {name: name, image: image,secondimage:secondimage, thirdimage:thirdimage ,description : desc,author : author, location : location, price : price,category:category,address:address}
	Foodstop.create(newfoodstop, function(err,addFoodstop){
		if(err){
			console.log(err)
		}
		else{ 
			console.log(req.body)
			res.redirect("/foodstops")
		}
	})
	
	
})

//NEW foodstop form
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("foodstops/new")
})

//SHOW Detail of foodstop
router.get("/:id", function(req,res){
	Foodstop.findById(req.params.id).populate("comments likes").exec(function(err,showfoodstop){
		if(err){
			console.log(err)
		}
		else{
			console.log(showfoodstop)
			res.render("foodstops/details", {foodstop: showfoodstop})		
		}
	})
	
})

//LIKES router
router.post("/:id/like", middleware.isLoggedIn,function(req,res){
	Foodstop.findById(req.params.id,function(err,likedfoodstop){
		if(err){
			console.log(err)
			return res.redirect("/foodstops")
		}
		var userLike = likedfoodstop.likes.some(function (like) {
            return like.equals(req.user._id);
        });
		if (userLike) {
			
            // user already liked, removing like
            likedfoodstop.likes.pull(req.user._id);
        } else {
            // adding the new user like
            likedfoodstop.likes.push(req.user);
        }
		likedfoodstop.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/foodstops");
            }
            return res.redirect("/foodstops/" + likedfoodstop._id);
        })

	})
})

//UPDATE foodstop
router.put("/:id",middleware.foodstopAuth,function(req,res){
	Foodstop.findByIdAndUpdate(req.params.id, req.body.foodstop, function(err,updatedfoodstop){
		if(err){
			res.redirect("/foodstops")
		}
		else{
			res.redirect("/foodstops/"+req.params.id)
		}
	})
	})

//EDIT foodstop
router.get("/:id/edit", middleware.foodstopAuth, function(req,res){
		Foodstop.findById(req.params.id,function(err,found){
				res.render("foodstops/edit" , {foodstop : found})		
			
	})	
})

//DELETE foodstop
router.delete("/:id", middleware.foodstopAuth,function(req, res){
	Foodstop.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/foodstops")
		}
		else{
			res.redirect("/foodstops")
		}
	})
})

module.exports = router