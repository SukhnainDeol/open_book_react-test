import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
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
    }, { timestamps: true }
);

const Test = mongoose.model('Test', userSchema)

module.exports = Test;