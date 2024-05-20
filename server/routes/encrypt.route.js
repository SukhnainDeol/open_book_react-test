const router = require('express').Router()
const En = require('../encryption/secret')

router.route('/').get( async (request, response) => {
    try {
        const password = request.query.password
        const newPassword = En.setPass(password)
        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json(newPassword);
    } catch (error) {
        console.log("ERROR:", error.message);
        response.status(500).send({message: error.message});
    }
})

module.exports = router
