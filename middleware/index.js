var Foodstop = require("../models/foodstop")
var Comment = require("../models/comment")

var middlewareObj = {}

middlewareObj.foodstopAuth = function(req,res,next){
	if(req.isAuthenticated()){
		Foodstop.findById(req.params.id,function(err,found){
		if(err){
			req.flash("error", "Foodstop not found")
			res.redirect("back")
		}
		else{
			if(found.author.id.equals(req.user._id) || req.user.isAdmin){
				next()
			}
			else
				{
					req.flash("error","You are not authorized to view this page")
					res.redirect("back")
				}
		}
	})	
	}
	else{
		res.redirect("back")
	}
}

middlewareObj.commentAuth = function (req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,found){
		if(err){
			res.redirect("back")
		}
		else{
			if(found.author.id.equals(req.user._id) || req.user.isAdmin){
				next()
			}
			else
				{
					req.flash("error","You are not authorized to add review. You need to Login first!")
					res.redirect("back")
				}
		}
	})	
	}
	else{
		res.redirect("back")
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error","You need to login to view this content. New User? ")
	res.redirect("/login")
}

module.exports = middlewareObj