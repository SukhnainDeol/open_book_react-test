const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
    {
        author : {
            type: String,
            required: true,
        },
        comment : {
            type: String,
            required: true,
        },
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
        imageURL : {
            type: String,
            required: false,
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
                default: 0,
            },
            users : {
                type: [String],
                default: [],
            },
        },
        comments: [commentSchema],
    }, {
        timestamps: true
    }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;