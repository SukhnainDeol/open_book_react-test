const express = require('express')
const app = express()

app.get("/api", (request, response) => {

    response.json({"users": ["testUser", "testSnoop"]})
})

app.listen(5000, () => {
    console.log("Server started on PORT 5000");
})