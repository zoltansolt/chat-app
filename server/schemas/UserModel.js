const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    _id: String,
    name: String
    },
    { collection: 'users' }
    )

module.exports = mongoose.model('Users',UserSchema)