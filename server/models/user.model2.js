const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 5
        },
        password : {
            type: String,
            required: true,
            trim: true,
            minLength: 5
        },
    }, {
        timestamps: true
    });

const User2 = mongoose.model('User2', userSchema);

module.exports = User2;