import mongoose from "mongoose";

const postSchema = mongoose.Schema(
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
    }
);

export const Post = mongoose.model('Post', postSchema);