const router = require('express').Router()

let User = require('../models/user.model.js')

// GET REQUESTS TO GET USERS
router.route('/').get((request, response) => {
    // mongoose function to find all users
    User.find()
    .then(
        users => response.json(users)) // returns all the users from the database
    .catch(
        err => response.status(400).json('Error: ' + err)); // if there's an error return that instead
})

// POST REQUEST TO ADD USER
router.route('/').post((request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    const newUser = new User({username, password});

    newUser.save()
    .then(() => response.json('User Added!')) // IF USER IS SUCCESSFULLY ADDED
    .catch(err => response.status(400).json('Error: ' + err)); // if there's an error return that instead
})


// PUT REQUEST TO EDIT USER
// app.put('/users/:id', async (request, response) => {
//     try {
//         if (
//             !request.body.username ||
//             !request.body.password
//         ) {
//             return response.status(400).send({
//                 message: "Username and Password fields are required",
//             });
//         }
//         const id = request.params.id;
        
//         const user = await User.findByIdAndUpdate(id, request.body);

//         if (!user) {
//             return response.status(404).json({message: "User not found"});
//         }

//         return response.status(201).send({message: "User update success!"});
//     } catch (error) {
//         console.log("ERROR:", error.message);
//         response.status(500).send({message: error.message});
//     }
// });

module.exports = router