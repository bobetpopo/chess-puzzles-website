const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    rating: {
        type: Number,
        default: 1200
    }
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)
module.exports = User 