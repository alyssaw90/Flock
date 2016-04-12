var express = require('express')
var path = require('path');
var app = express()

app.use(express.static(path.join(__dirname, 'public')))

var apiCtrl = require("./api/")
app.use("/api", apiCtrl)

app.get('/*', function(req,res){
	res.sendFile(path.join(__dirname, 'public/index.html'))
})

var port = process.env.PORT || 3000;
var serverip = process.env.IP || "localhost";

app.listen(port, serverip);
console.log('Server running at '+serverip+":"+port);