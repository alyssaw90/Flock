var express = require("express");
var router = express.Router();
var request = require("request");

var Firebase = require("firebase")
var rootRef = new Firebase(process.env.FIREBASE_URL)
rootRef.authWithCustomToken(process.env.FIREBASE_TOKEN, function(error, authData) {
})

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
	console.log(ll)
	var type = req.query.type
	var requestObject = {
		url:"https://api.foursquare.com/v2/venues/explore",
		qs: {
			ll:'47.676402,-122.317612',//ll,
			section: type,
			client_id:process.env.FOURSQUARE_CLIENT_ID,
			client_secret:process.env.FOURSQUARE_CLIENT_SECRET,
			v:20160410,
			radius: 1000, //radius in meters
			openNow: 0 //1: only show open, 0: show all
		}
	}
	if(type==='drinks'){
		filterHappyHour(requestObject, res)
	}else{
		foursquare(requestObject, res)
	}
})

// 

router.get('/sg', function(req, res){
	if(!req.query.ll||!req.query.type){
		return res.status(400).json({error:"Invalid search type."})
	}
	var ll = req.query.ll

	var llSplit = ll.split(',')
	if(llSplit.length!==2){
		return res.status(400).json({error:"Invalid search type."})
	}
	var lat = parseFloat(llSplit[0])||0
	var lon = parseFloat(llSplit[1])||0
	var type = req.query.type


	var now = new Date()
	var dtstart = new Date(now.getTime()+(30*60*1000))
	var dtend = new Date(now.getTime()+(24*60*60*1000))

	var requestObject = {
		url: "https://api.seatgeek.com/2/events",
		qs:{
			lat: lat,
			lon: lon,
			type: type,
			range: '10mi',
			'datetime_utc.gte': dtstart.toISOString(),
			'datetime_utc.lte': dtend.toISOString()
		}
	}
	seatgeek(requestObject,res)
})

module.exports = router;

function foursquare(requestObject, res){
	request(requestObject, function(error, response, body){
		var results = JSON.parse(body).response
		if(!results.groups){
			return res.json({count:0,results:[]})
		}
		results=results.groups[0].items
		var newResults = results.map(function(result){
			var ret = {}
			ret.type="fs"
			ret.lat = result.venue.location.lat
			ret.lon = result.venue.location.lng
			ret.name = result.venue.name
			ret.hours = result.venue.hours
			ret.address = result.venue.location.address+' '+result.venue.location.city+' '+result.venue.location.state+' '+result.venue.location.postalCode
			ret.url = result.venue.url
			return ret
		})
		res.json({count:results.length,results:newResults})
	})
}

function seatgeek(requestObject, res){
	request(requestObject, function(error, response, body){
		var results = JSON.parse(body)
		var newResults = results.events.map(function(result){
			var ret = {}
			ret.type="sg"
			ret.lat = result.venue.location.lat
			ret.lon = result.venue.location.lon
			ret.name = result.venue.name
			ret.address = result.venue.address+' '+result.venue.extendedAddress
			ret.url = result.venue.url
			return ret
			//no venue image, but some performance images
		})
		res.json({count:results.meta.total,results:newResults})
	})
}

function filterHappyHour(requestObject, res){
	var day = new Date().getDay()
	var hour = new Date().getHours()
	rootRef.child('bars').orderByChild('ID').once('value', function(snapshot){
		var filtered = []
		snapshot.forEach(function(data){
			var val = data.val()
			if(val[day]){
				var range = val[day].split('-')
				var startHour = parseInt(range[0].split(':')[0])
				var endHour = parseInt(range[1].split(':')[0])
				if(endHour<startHour)
					endHour = 24 //happy hour extends to next day, so is still active
				if(hour>=startHour&&hour<=endHour)
					filtered.push(data.key())
			}
		})
		happyHour(requestObject, filtered, res)
	})
}	

function happyHour(requestObject, filter, res){
	request(requestObject, function(error, response, body){
		var results = JSON.parse(body).response.groups[0].items
		var newResults = results.filter(function(result){
			var id=result.venue.id
			if(filter.indexOf(id)!==-1)
				return true
			return false	
		}).map(function(result){
			var ret = {}
			ret.type="fs"
			ret.lat = result.venue.location.lat
			ret.lon = result.venue.location.lng
			ret.name = result.venue.name
			ret.hours = result.venue.hours
			ret.address = result.venue.location.address+' '+result.venue.location.city+' '+result.venue.location.state+' '+result.venue.location.postalCode
			ret.url = result.venue.url
			return ret
		})
		res.json({count:newResults.length,results:newResults})
	})
}