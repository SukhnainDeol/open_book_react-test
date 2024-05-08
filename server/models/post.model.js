const mongoose = require('mongoose')

const replySchema = mongoose.Schema(
    {
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
    }, {
        timestamps: true
    }
);

const postSchema = mongoose.Schema(
    {
        author : {
            type: String,
            required: true,
        },
        title : {
            type: String,
            required: true,
        },
        text : {
            type: String,
            required: true,
            trim: true,
        },
        date : {
            type: Date,
            required: true,
        },
        likes : {
            count : {
                type: Number,
                required: true,
                default: 0,
            },
            users : {
                type: [String],
                default: [],
            },
        },
        dislikes : {
            count : {
                type: Number,
                required: true,
                default: 0,
            },
            users : {
                type: [String],
                default: [],
            },
        },
        replies: [replySchema],
    }, {
        timestamps: true
    }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;