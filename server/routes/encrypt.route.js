const router = require('express').Router()
const encryptor = require('../encryption/secret');

// GET REQUESTS TO GET ENCRYPTED PASSWORD
router.route('/').get( async (request, response) => {
    try {
        // get users & return them
        const password = request.body.password;
        return response.status(200).json(encryptor.setPass(password));
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})
