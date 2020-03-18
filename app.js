var express       = require("express")
var app           = express()
var bodyparser    = require("body-parser")
var mongoose      = require("mongoose")
var flash         = require("connect-flash")
var cookie        = require("cookie-session")
var passport      = require("passport")
var moment        = require("moment-timezone")
var LocalStrategy = require("passport-local")
var methodoverride = require("method-override")
var Foodstop      = require("./models/foodstop")
var Comment       = require("./models/comment")
var User          = require("./models/user") 
var seedDb        = require("./seed")
var authRoute     = require("./routes/auth")
const GoogleStrategy = require("passport-google-oauth20")
var keys = require("./config/keys")
// var passportSetup = require("./config/passport_auth")ss
var commentsRoute = require("./routes/comments")
var foodstopsRoute = require("./routes/foodstops")
// var profileRoute = require("./routes/profile")
var indexRoute = require("./routes/index")

mongoose.set('useUnifiedTopology', true);
// mongoose.set('useCreateIndex', true)
// mongoose.connect("mongodb://127.0.0.1:27017/food_stop",{ useNewUrlParser: true })ss
mongoose.connect("mongodb+srv://prajakta:prajakta@foodstopcluster-79lyt.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true,autoIndex: false })


app.use(express.static("public"))
// app.use(express.static("public"))
app.use(bodyparser.urlencoded({extended:true}))
app.use(methodoverride("_method"))
app.use(flash())
app.set("view engine","ejs")

// app.use(cookie({
// 	maxAge:24*60*60*1000,
// 	keys:["mischief managed"]
// }))


//Passport Configuration

app.use(require("express-session")({
	secret:"mischief managed",
	resave:false,
	saveUninitialized:false
}))
app.locals.moment = require('moment');
moment().tz("Asia/kolkata").format()
moment().utcOffset("+05:30").format()

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user,done)=>{
	done(null,user.id)
})
passport.deserializeUser((id,done)=>{
	User.findById(id).then((user)=>{
		done(null,user)
	})
})
passport.use(new LocalStrategy(User.authenticate()))
passport.use(new GoogleStrategy({
	callbackURL:'https://review-daaqd.run.goorm.io/auth/google/redirect',
	clientID: keys.google.clientID,
	clientSecret:keys.google.clientSecret
},(accessToken,refreshToken,profile,done)=>{
	User.findOne({'google.googleId':profile.id}).then((currentUser)=>{
		if(currentUser){
			console.log("User is already Logged in : "+currentUser)
			done(null,currentUser)
		}
		else{
			var newuser = new User()
		newuser.google.username = profile.displayName,
		newuser.google.googleId = profile.id
	newuser.save().then((Newuser)=>{
		console.log("New User : "+Newuser)
				done(null,Newuser)
	})
		}
	})
	
}))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next();
})

app.use("/foodstops",foodstopsRoute)
app.use("/foodstops/:id/comments",commentsRoute)
app.use("/auth",authRoute)
// app.use("/profile",profileRoute)
app.use(indexRoute)


app.listen(3000,()=>{
	console.log("Reviews Begins")
})