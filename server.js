const express = require('express')
const path = require('path')
const cors = require('cors')

const port = process.env.PORT || 8080
const app = express()
app.use(cors())

// the __dirname is the current directory from where the script is running
// app.use(express.static(__dirname));
app.use(express.static(__dirname + '/build'))

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/public/index.html'))
})

// app.listen(port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
