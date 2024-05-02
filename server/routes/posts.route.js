const router = require('express').Router()
const Post = require('../models/post.model');


// GET REQUESTS

// POST REQUESTS
router.route('/').post(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(
            request.body.author && request.body.text && request.body.date 
            && request.body.likes && request.body.likes.count 
            && request.body.dislikes && request.body.dislikes.count
        )) {
            return response.status(400).send({
                message: "Author, Text, Date, Likes Count, and Dislikes Count fields are required",
            });
        }
        
        // create new post
        const newPost = {
            author: request.body.author,
            text: request.body.text,
            date: request.body.date,
            likes: {
                count: request.body.likes.count,
                users: request.body.likes.users
            },
            dislikes: {
                count: request.body.dislikes.count,
                users: request.body.dislikes.users,
            }, // use map to iterate over each object to create reply objects
            replies: request.body.replies.map(reply => ({
                author: reply.author,
                text: reply.text,
                date: reply.date,
            }))
        }
        
        // add post to database
        await Post.create(newPost);
        return response.status(201).send({message: "Post Created Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// PUT REQUESTS


// DELETE REQUESTS



module.exports = router