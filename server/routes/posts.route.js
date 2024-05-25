const router = require('express').Router()
const Post = require('../models/post.model');
const User = require('../models/user.model');


// GET REQUEST FOR MOST RECENT USER POST
router.route('/username-recent').get(async (request, response) => {
    try {
        const author = request.query.author;
        const posts = await Post.find({author: {$eq: author}}).sort({_id:-1}).limit(1);
        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json(posts);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// GET REQUEST FOR RANDOM USER POST THAT ISN'T CURRENT USER
router.route('/random').get(async (request, response) => {
    try {
        // get posts & and return them
        const username = request.query.username;
        const posts = await Post.aggregate([
            { $match: { author: { $not: { $eq: username } } } },{ $sample: { size: 1  }}
        ])
        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json(posts);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// NEW GET REQUEST FOR SPECIFIC USER POSTS
router.route('/username').get(async (request, response) => {
    try {
        const author = request.query.author;
        const posts = await Post.find({author: {$eq: author}}).sort({"createdAt": 1});
        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json(posts);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// GET REQUESTS
router.route('/').get(async (request, response) => {
    try {
        // get posts & and return them
        const posts = await Post.find({});
        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json(posts);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// GET REQUESTS for specific post
router.route('/id').get(async (request, response) => {
    try {
        // get posts & and return them
        const id = request.query.id;
        const posts = await Post.find({_id: {$eq: id}});
        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json(posts);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// GET Most/Least liked Post
router.route('/liked').get(async (request, response) => {
    try {
        
        let mostLiked = await Post.find({
            "date": 
            {
                // greater than date of (right now - 1 day)
                $gte: new Date (new Date().getTime() - (24 * 60 * 60 * 1000)),
            }
        }).limit(10).sort({ "likes.count": -1}); // sort by most likes first
       
        return response.status(200).json(mostLiked);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


// GET Most/Least liked Post
router.route('/disliked').get(async (request, response) => {
    try {
        
        let mostDisliked = await Post.find({
            "date": 
            {
                // greater than date of (right now - 1 day)
                $gte: new Date (new Date().getTime() - (24 * 60 * 60 * 1000))
            }
        }).limit(10).sort({ "dislikes.count": -1}); // sort by most dislikes first
       
        return response.status(200).json(mostDisliked);
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
            request.body.author && request.body.title && request.body.text && request.body.date 
        )) {
            return response.status(400).send({
                message: "Author, Title, Text, Date and fields are required",
            });
        }
        
        let doesExist = await User.exists({username: request.body.author});
        if (doesExist == null) {
            return response.status(400).send({
                message: "Author does not exist",
            });
        }

        // add post to database
        await Post.create(request.body);
        return response.status(201).send({message: "Post Created Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})




// PUT REQUESTS
router.route('/id').put(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(
            request.body.author && request.body.title && request.body.text && request.body.date 
        )) {
            return response.status(400).send({
                message: "Author, Title, Text, Date, Likes Count, and Dislikes Count fields are required",
            });
        }

        // edit post
        const id = request.query.id;
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




// PATCH REQUESTS
// patch post text/title
router.route('/text').patch(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(request.body.text && request.body.title)) {
            return response.status(400).send({
                message: "Text and Title fields are required",
            });
        }
        
        // edit post text
        const postId = request.query.postId;
        const post = await Post.findOneAndUpdate(
            { _id: postId}, // get post
            {
                $set: { // update post
                    "text": request.body.text,
                    "title": request.body.title,
                }
            },
        );

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }

        // success Response
        return response.status(200).send({message: "Post's Text and Title Updated Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// patch post likes
router.route('/likes').patch(async (request, response) => {
    try {
        
        // edit post 
        const id = request.query.id;
        const post = await Post.findOneAndUpdate(
            { _id: id}, // get post
            {
                $set: { // update post
                    "likes":{
                        "count": request.body.count,
                        "users": request.body.users,
                    }
                }
            },
        );

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }

        // success Response
        return response.status(200).send({message: "Post's Like Count and Users Updated Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// patch post dislikes
router.route('/dislikes').patch(async (request, response) => {
    try {
        
        // edit post 
        const id = request.query.id;
        const post = await Post.findOneAndUpdate(
            { _id: id}, // get post
            {
                $set: { // update post
                    "dislikes":{
                        "count": request.body.count,
                        "users": request.body.users,
                    }
                }
            },
        );

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }

        // success Response
        return response.status(200).send({message: "Post's Dislike Count and Users Updated Successfully!"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})




// DELETE REQUESTS
router.route('/id').delete(async (request, response) => {
    try {
        // delete post
        const id = request.query.id;
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

// COMMENT PATCH REQUEST TO PUSH NEW COMMENT
router.route('/remove-comment').patch(async (request, response) => {
    try {
        
        // edit post 
        const id = request.query.id;
        const username = request.query.username;

        const post = await Post.updateOne(
            { _id: id}, // FINDS THE POST BY ID
            {
                $pull: { "comments.author": username } 
            },
        );

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }

        // success Response
        return response.status(200).send({message: "Your Comment Has Been Added Successfully"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

// COMMENT PATCH REQUEST TO PUSH NEW COMMENT
router.route('/add-comment').patch(async (request, response) => {
    try {
        
        // edit post 
        const id = request.query.id;
        const comment = request.query.comments;
        const username = request.query.username;

        const post = await Post.updateOne(
            { _id: id}, // FINDS THE POST BY ID
            {
                $push: {
                    comments: {
                        author: username, comment: comment
                    }
                } 
            },
        );

        console.log("DONE");

        // not found Response
        if (!post) {
            return response.status(404).send({message: "Post not found"});
        }

        // success Response
        return response.status(200).send({message: "Your Comment Has Been Added Successfully"});
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})


module.exports = router