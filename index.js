const express = require('express')
const path = require('path')
const app = express()


//Serve up public files.
//app.use(express.static(path.join(__dirname,'public'))); 


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
})

app.listen(3000, () => console.log('Listening on Port 3000'))