const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname,'public')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
})

var port = process.env.PORT || 3000;
app.listen(port, function() { console.log('Listening on Port 3000') });