const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 5,
            maxLength: 10
        },
        password : {
            type: String,
            required: true,
            trim: true,
            minLength: 5,
            maxLength: 30
        },
        loggedIn : {
            type: Boolean,
            required: true,
            default: true,
        },
    }, {
        timestamps: true
    });

const User = mongoose.model('User', userSchema);

module.exports = User;