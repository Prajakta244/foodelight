var mongoose = require("mongoose")
var Foodstop = require("./models/foodstop")
var Comment  = require("./models/comment")

var data = [
	{
		name: "Item1",
		image : "https://www.holidify.com/blog/wp-content/uploads/2015/09/img13.jpg",
		description : "tastiest dish"
	},
	{
		name: "Item2",
		image : "https://www.holidify.com/blog/wp-content/uploads/2015/09/kulfi-street-food-ahmedabad.jpg",
		description : "tastiest dish2"
	}
]

function seedDb(){
	Foodstop.deleteMany({}, function(err){
	if(err){
		console.log(err)
	}
	console.log("foodstop removed")
		data.forEach(function(seed){
			Foodstop.create(seed, function(err, foodstop){
				if(err){
					console.log(err)
				}
				else{
					console.log("foodstop added")
					Comment.create({
						name : "my first comment",
						author : "prajakat"
					}, function(err, comment){
						if(err){
							console.log(err)
						}
						else{
							foodstop.comments.push(comment)
							foodstop.save()
							console.log("comment created")
						}
					})
				}
			})
		})
})	
}

module.exports = seedDb
