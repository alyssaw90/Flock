var express = require('express')
var path = require('path');
var app = express()

app.use(express.static(path.join(__dirname, 'public')))

var apiCtrl = require("./api/")
app.use("/api", apiCtrl)

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'static/index.html'))
})

app.post('/login', function(req, res){
	//setup user session, redirect to map
	res.redirect('/map')
})

app.post('/register', function(req, res){
	//create user, redirect to login
	res.redirect('/')
	//or autologin and redirect to map
	//res.redirect('/map')
})

app.get('/map', function(req,res){
	//validate usersession here
	res.sendFile(path.join(__dirname, 'static/map.html'))
})

app.get('/details/:id', function(req, res){
	//show subpage
})

// var port = process.env.PORT || 3000;
// var serverip = process.env.IP || "localhost";

// app.listen(port, serverip);
// console.log('Server running at '+serverip+":"+port);
app.listen(process.env.PORT || 3000)