var express = require("express")
var router = express.Router()
var passport = require("passport")

router.get("/login",function(req,res){
	res.render("login")
})

router.get("/google",passport.authenticate('google',{
	scope:['profile']
}))

router.get("/google/redirect",passport.authenticate('google'),function(req,res){
	res.redirect('/profile/')
})

// router.post("/login", function (req, res, next) {
//   passport.authenticate("local",
//     {
//       successRedirect: "/foodstops",
//       failureRedirect: "/login",
//       failureFlash: true,
//       successFlash: "Welcome to FooDelight, " + req.body.username + "!"
//     })(req, res);
// });

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You have been successfully logged out!")
	res.redirect("/foodstops")
})

module.exports = router