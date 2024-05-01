const mongoose = require('mongoose')

const replySchema = mongoose.Schema(
    {
        originalAuthor: {
            type: String,
            required: true,
        },
        author : {
            type: String,
            required: true,
        },
        text : {
            type: String,
            required: true,
        },
        date : {
            type: Date,
            required: true,
        },
    }
);
 
const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;