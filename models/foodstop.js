var mongoose = require("mongoose")
var foodstopSchema = new mongoose.Schema({
	name : String,
	image : String,
	secondimage : String,
	thirdimage : String,
	description : String,
	location: String,
	price : String,
	category:String,
	address:String,
	createdAt : {
		type :Date,
		default : Date.now
	},
	author : {
		 id :{
			 type : mongoose.Schema.Types.ObjectId,
			 ref : "User"
		 },
		 username : String
	 },
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	],
	likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
	
})

module.exports = mongoose.model("Foodstop", foodstopSchema)
