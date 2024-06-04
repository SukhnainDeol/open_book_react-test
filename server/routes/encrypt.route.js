const router = require('express').Router()
const En = require('../encryption/secret') // ENCRYPTION FILE

router.route('/').get( async (request, response) => {
    try {
        const password = request.query.password // PASSWORD FROM USER
        const newPassword = En.setPass(password) // ENCRYPTS PASSWORD
        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json(newPassword); // RETURNS ENCRYPTED PASSWORD
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

module.exports = router
