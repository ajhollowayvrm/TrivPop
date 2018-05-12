const express = require('express')
const path = require('path')
const app = express()

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get('/', function (req, res) {
    res.render('home', {
        static_path: 'public'
    })
})

var port = process.env.PORT || 3000;
app.listen(port, function() { console.log('Listening on Port 3000') });