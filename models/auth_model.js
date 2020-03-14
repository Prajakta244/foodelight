const mongoose = require("mongoose")
const schema = mongoose.Schema

const authSchema = new schema({
	username : String,
	googleId : String
})

const google_user = mongoose.model('google_user',authSchema)

module.exports = google_user