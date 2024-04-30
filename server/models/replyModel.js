import mongoose from "mongoose";

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

export const Reply = mongoose.model('Reply', replySchema);