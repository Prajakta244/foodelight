var express = require("express")
var router = express.Router()
var passport = require("passport")

var authCheck = (req,res,next)=>{
	if(!req.user){
	   res.redirect("/auth/login")
	   }
	   else{
		   next()
	   }
}

router.get('/',authCheck,(req,res)=>{
	res.redirect('/foodstops')
})

module.exports = router