const router = require('express').Router()
const Post = require('../models/post.model');


// GET REQUESTS
router.route('/').get(async (request, response) => {
    try {
        // get posts & and return them
        const posts = await Post.find({});
        return response.status(200).json(posts);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


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
router.route('/:id').put(async (request, response) => {
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
        
        // edit post
        const id = request.params.id;
        const post = await Post.findByIdAndUpdate(id, request.body);

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }

        // success Response
        return response.status(200).send({message: "Post Updated Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


// DELETE REQUESTS
router.route('/:id').delete(async (request, response) => {
    try {
        // delete post
        const id = request.params.id;
        const post = await Post.findByIdAndDelete(id);

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }

        // success Response
        return response.status(200).send({message: "Post Deleted Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


// GET REPLY REQUESTS
router.route('/:id').get(async (request, response) => {
    try {
        // get replies from specific post & and return them
        const replies = await Post.find({_id: request.params.id}).select("replies -_id");
        return response.status(200).json(replies);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


// POST REPLY REQUESTS
router.route('/:id').post(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(
            request.body.author && request.body.text && request.body.date 
        )) {
            return response.status(400).send({
                message: "Author, Text, and Date fields are required",
            });
        }
        
        // create new reply
        const newReply = {
            author: request.body.author,
            text: request.body.text,
            date: request.body.date,
        }

        // add reply
        const id = request.params.id;
        const post = await Post.findByIdAndUpdate(id, { $push: { replies: newReply } });

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }
        
        return response.status(201).send({message: "Reply Created Successfully"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


// PUT REPLY REQUESTS
router.route('/:id/reply/:replyId').put(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(
            request.body.author && request.body.text && request.body.date 
        )) {
            return response.status(400).send({
                message: "Author, Text, and Date fields are required",
            });
        }
        
        // find post & its reply then update
        const postId = request.params.id;
        const replyId = request.params.replyId;
        const post = await Post.findOneAndUpdate(
            { _id: postId, "replies._id": replyId}, // get specific reply in post
            {
                $set: { // update reply
                    "replies.$.author": request.body.author,
                    "replies.$.text": request.body.text,
                    "replies.$.date": request.body.date,
                },
            },
            {
                new: true,
            }
        );

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }
        
        return response.status(201).send({message: "Reply Updated Successfully"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


// DELETE REPLY REQUESTS
router.route('/:id/reply/:replyId').delete(async (request, response) => {
    try {
        // find post & delete reply
        const postId = request.params.id;
        const replyId = request.params.replyId;
        // Pulls specific reply from specific post
        const post = await Post.findOneAndUpdate({ _id: postId }, { $pull: { replies: { _id: replyId }} });

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }
        
        return response.status(201).send({message: "Reply Deleted Successfully"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})




module.exports = router