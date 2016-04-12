var express = require("express");
var router = express.Router();
var request = require("request");

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
	var ll = req.query.ll
	var type = 'food'
	var url = "https://api.foursquare.com/v2/venues/explore"
	request({
		url:url,
		qs: {
			ll:ll,
			section: type,
			client_id:process.env.FOURSQUARE_CLIENT_ID,
			client_secret:process.env.FOURSQUARE_CLIENT_SECRET,
			v:20160410,
			radius: 1000, //radius in meters
			openNow: 1 //1: only show open, 0: show all
		}
	}, function(error, response, body){
		var results = JSON.parse(body).response.groups[0].items
		res.json({count:results.length,results:results})
	})
})

module.exports = router;