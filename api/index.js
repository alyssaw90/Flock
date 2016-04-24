var express = require("express");
var router = express.Router();
var request = require("request");

var validSearchTypes = ['food','drinks','coffee','shops','outdoors']

/*
Route: /api/search
Parameters:
	ll (string) 47.620019,-122.349156 (Space Needle)
	Latitude and Longitude of center of search in format: "##.#,##.#"
	radius (number)
	maximum radius in meters from ll to search
	type (string)
	Type of search to perform
*/
router.get('/search', function(req, res){
	if(!req.query.ll){
		return res.status(400).json({error:"Unable to read location."})
	}
	if(validSearchTypes.indexOf(req.query.type)===-1){
		return res.status(400).json({error:"Invalid search type."})
	}
	var ll = req.query.ll
	var type = req.query.type
	var requestObject = {
		url:"https://api.foursquare.com/v2/venues/explore",
		qs: {
			ll:ll,
			section: type,
			client_id:process.env.FOURSQUARE_CLIENT_ID,
			client_secret:process.env.FOURSQUARE_CLIENT_SECRET,
			v:20160410,
			radius: 1000, //radius in meters
			openNow: 0 //1: only show open, 0: show all
		}
	}
	foursquare(requestObject, res)
})

// 

router.get('/seatgeek', function(req, res){
	var now = new Date()
	var dtstart = new Date(now.getTime()+(30*60*1000))
	var dtend = new Date(now.getTime()+(24*60*60*1000))

	var ll = req.query.ll

	var requestObject = {
		url: "https://api.seatgeek.com/2/events",
		qs:{
			lat: 47.6762633,
			lon: -122.31862819,
			type: 'comedy',
			range: '10mi',
			'datetime_utc.gte': dtstart.toISOString(),
			'datetime_utc.lte': dtend.toISOString()
		}
	}
	seatgeek(requestObject,res)
	// res.send(dtstart.toISOString())
})

module.exports = router;

function foursquare(requestObject, res){
	request(requestObject, function(error, response, body){
		var results = JSON.parse(body).response.groups[0].items
		res.json({count:results.length,results:results})
	})
}

function seatgeek(requestObject, res){
	request(requestObject, function(error, response, body){
		var results = JSON.parse(body)
		res.json({count:results.length,results:results})
	})
}