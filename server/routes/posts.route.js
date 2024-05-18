const router = require('express').Router()
const Post = require('../models/post.model');
const User = require('../models/user.model');


// todo
    // password encryption / hashing
    // test requests
    // security checks
    // hosting
    // request
        // random user
        // user's post
    // validaters
        // likes / dislikes >= 0
            // likes count == users.count
            // users cant like & dislike same post
        // no space in author name
        // text and title less than max
        // arrays are strings


/** (Currently not working)
 * 
 * @param {*} username - string of username in database 
 * 
 * @returns - true/false if user exists
 */
async function userExists(username) {
    try {
        let user = await User.find({username: username});
        console.log(user);
        user = user ? true : false
        return user;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// GET REQUEST FOR RANDOM USER POST
router.route('/random').get(async (request, response) => {
    try {
        // get posts & and return them
        const username = request.query.username;
        const posts = await Post.aggregate([
            { $match: { username: { $not: { $eq: username } } } },{ $sample: { size: 1  }}
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
        const posts = await Post.find({author: {$eq: author}});
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
        
        let mostDisliked = await Post.findOne({
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
                message: "Author, Title, Text, Date, Likes Count, and Dislikes Count fields are required",
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
router.route('/:id').put(async (request, response) => {
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


// PATCH REQUESTS
// patch post text/title
router.route('/:postId/text').patch(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(request.body.text && request.body.title)) {
            return response.status(400).send({
                message: "Text and Title fields are required",
            });
        }
        
        // edit post text
        const postId = request.params.postId;
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
router.route('/:postId/likes').patch(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(request.body.likes && request.body.likes.count && request.body.likes.users)) {
            return response.status(400).send({
                message: "Likes Count and Users fields are required",
            });
        }
        
        // edit post 
        const postId = request.params.postId;
        const post = await Post.findOneAndUpdate(
            { _id: postId}, // get post
            {
                $set: { // update post
                    "likes":{
                        "count": request.body.likes.count,
                        "users": request.body.likes.users,
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
router.route('/:postId/dislikes').patch(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(request.body.dislikes && request.body.dislikes.count && request.body.dislikes.users)) {
            return response.status(400).send({
                message: "Dislikes Count and Users fields are required",
            });
        }
        
        // edit post 
        const postId = request.params.postId;
        const post = await Post.findOneAndUpdate(
            { _id: postId}, // get post
            {
                $set: { // update post
                    "dislikes":{
                        "count": request.body.dislikes.count,
                        "users": request.body.dislikes.users,
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
        response.setHeader('Content-Type', 'application/json');
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


// PATCH REPLY REQUESTS
// patch reply text
router.route('/:id/reply/:replyId/text').patch(async (request, response) => {
    try {
        // check if required fields are filled
        if (!(request.body.text)) {
            return response.status(400).send({
                message: "Text field is required",
            });
        }
        
        // find post & its reply then update
        const postId = request.params.id;
        const replyId = request.params.replyId;
        const post = await Post.findOneAndUpdate(
            { _id: postId, "replies._id": replyId}, // get specific reply in post
            {
                $set: { // update reply
                    "replies.$.text": request.body.text,
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