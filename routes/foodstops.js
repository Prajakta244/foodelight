var express = require("express")
var router = express.Router()
var Foodstop = require("../models/foodstop")
var middleware = require("../middleware")


router.get("/foodstops", function(req, res){
	Foodstop.find({},function(err,allFoodstops){
		if(err){
			console.log(err)
		}
		else{
			res.render("foodstops/foodstops", {foodstops:allFoodstops})		
		}
	})
	
})

router.post("/foodstops", middleware.isLoggedIn, function(req,res){
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
	var location = req.body.location
	var newfoodstop = {name: name, image: image,secondimage:secondimage, thirdimage:thirdimage ,description : desc,author : author, location : location, price : price}
	Foodstop.create(newfoodstop, function(err,addFoodstop){
		if(err){
			console.log(err)
		}
		else{
			res.redirect("/foodstops")
		}
	})
	
	
})
router.get("/foodstops/new",middleware.isLoggedIn, function(req,res){
	res.render("foodstops/new")
})

router.get("/foodstops/:id", function(req,res){
	Foodstop.findById(req.params.id).populate("comments").exec(function(err,showfoodstop){
		if(err){
			console.log(err)
		}
		else{
			console.log(showfoodstop)
			res.render("foodstops/details", {foodstop: showfoodstop})		
		}
	})
	
})

router.put("/foodstops/:id",middleware.foodstopAuth,function(req,res){
	Foodstop.findByIdAndUpdate(req.params.id, req.body.foodstop, function(err,updatedfoodstop){
		if(err){
			res.redirect("/foodstops")
		}
		else{
			res.redirect("/foodstops/"+req.params.id)
		}
	})
	})

router.get("/foodstops/:id/edit", middleware.foodstopAuth, function(req,res){
		Foodstop.findById(req.params.id,function(err,found){
				res.render("foodstops/edit" , {foodstop : found})		
			
	})	
})

router.delete("/foodstops/:id", middleware.foodstopAuth,function(req, res){
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