var express = require("express")
var router = express.Router()
var Foodstop = require("../models/foodstop")
var Comment = require("../models/comment")
var middleware = require("../middleware")

router.get("/foodstops/:id/comments/new", middleware.isLoggedIn,function(req,res){
	Foodstop.findById(req.params.id, function(err, foodstop){
		if(err){
			console.log(err)
		}
		else{
			res.render("comments/new", {foodstop:foodstop})
		}
	})
})

router.post("/foodstops/:id/comments/",middleware.isLoggedIn, function(req,res){
	Foodstop.findById(req.params.id, function(err,foodstop){
		if(err){
		console.log(err)
			res.redirect("/foodstops")
	}
	else{
		Comment.create(req.body.comment, function(err, comment){
			comment.author.id = req.user._id
			comment.author.username = req.user.username
			comment.save()
			foodstop.comments.push(comment)
			foodstop.save()
			res.redirect('/foodstops/'+foodstop._id)
		})
	}
	})
})

router.get("/foodstops/:id/comments/:comment_id/edit",middleware.commentAuth, function(req, res){
	Comment.findById(req.params.comment_id, function(err,foundcomment){
		if(err){
			res.redirect("back")
		}
		else{
			res.render("comments/edit", {foodstop_id : req.params.id, comment : foundcomment})	
		}
	})
})

router.put("/foodstops/:id/comments/:comment_id", middleware.commentAuth,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentbody){
		if(err){
			res.redirect("back")
		}
		else{
			res.redirect("/foodstops/"+req.params.id)
		}
	})
})

router.delete("/foodstops/:id/comments/:comment_id", middleware.commentAuth,function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back")
		}
		else{
			req.flash("error","Review Deleted!")
			res.redirect("/foodstops/"+req.params.id)
		}
	})
})

module.exports = router