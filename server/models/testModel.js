import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password : {
            type: String,
            required: true,
        },
        entries : [{
            id : {
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
            replies: [{
                id: {
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
            }]
        }],
    }
);

export const User = mongoose.model('Test', userSchema);