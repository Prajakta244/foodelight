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
var passportSetup = require("./config/passport_auth")
var commentsRoute = require("./routes/comments")
var foodstopsRoute = require("./routes/foodstops")
var indexRoute = require("./routes/index")

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true)
// mongoose.connect("mongodb://127.0.0.1:27017/food_stop",{ useNewUrlParser: true })ss
mongoose.connect("mongodb+srv://prajakta:prajakta@foodstopcluster-79lyt.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true })


app.use(express.static("public"))
// app.use(express.static("public"))
app.use(bodyparser.urlencoded({extended:true}))
app.use(methodoverride("_method"))
app.use(flash())
app.set("view engine","ejs")

app.use(cookie({
	maxAge:24*60*60*1000,
	keys:["mischief managed"]
}))


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
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next();
})

app.use("/foodstops",foodstopsRoute)
app.use("/foodstops/:id/comments",commentsRoute)
app.use("/auth",authRoute)
app.use(indexRoute)


app.listen(3000,()=>{
	console.log("Reviews Begins")
})