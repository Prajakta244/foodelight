const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
var keys = require("./keys")
const User = require("../models/auth_model")

passport.serializeUser((user,done)=>{
	done(null,user.id)
})
passport.deserializeUser((id,done)=>{
	User.findById(id).then((user)=>{
		done(null,user)
	})
})


passport.use(new GoogleStrategy({
	callbackURL:'https://review-daaqd.run.goorm.io/auth/google/redirect',
	clientID: keys.google.clientID,
	clientSecret:keys.google.clientSecret
},(accessToken,refreshToken,profile,done)=>{
	User.findOne({googleId:profile.id}).then((currentUser)=>{
		if(currentUser){
			console.log("User is already Logged in : "+currentUser)
			done(null,currentUser)
		}
		else{
			new User({
		username : profile.displayName,
		googleId : profile.id
	}).save().then((Newuser)=>{
		console.log("New User : "+Newuser)
				done(null,Newuser)
	})
		}
	})
	
}))