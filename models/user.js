var mongoose = require("mongoose")
var PassportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
	name : String,
	password:String,
	firstname : String,
	lastname : String,
	profile : String,
	email : String,
	isAdmin : {
		type : Boolean,
		default : false
	}
})

UserSchema.plugin(PassportLocalMongoose);
module.exports= mongoose.model("User", UserSchema);