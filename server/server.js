const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get("/api", (request, response) => {

    response.json({"users": ["testUser", "testSnoop"]})
})

app.listen(5000, () => {
    console.log("Server started on PORT 5000");
})