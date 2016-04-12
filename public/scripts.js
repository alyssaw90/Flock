$(function(){
    var map, myLayer, myLat, myLong

    getLocation()

    //get current geolocation
    function getLocation(){
        if(navigator && navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function success(position){
                myLat = position.coords.latitude
                myLong = position.coords.longitude
                initMap(myLat, myLong)
            }, function error(){

            })
        }else{
            $("#id").html("Geolocation not supported on this device")
        }
    }
    function initMap(lat, long){
        L.mapbox.accessToken = 'pk.eyJ1IjoidG9kZGJlc3QyMDA0IiwiYSI6ImNpbXhra2JsZjAzanh1d200aDB0cmI1Z3oifQ.ZVQ1Gg1zsOnYvud8rv4shA';
        map = L.mapbox.map('map', 'mapbox.streets')
          .setView([lat, long], 14);

        
    }

    $("#test").click(function(){
        if(myLat&&myLong){
            $.get({
                url: '/api/search',
                data:{
                    ll: myLat+","+myLong
                }
            }).done(function(response){
                // console.log(response.results)
                addMarkers(response.results)
            })
        }
    })

    function addMarkers(results){
        if(results&&results.length){
            var geoJson={
                type:'FeatureCollection',
                features:[]
            }
            for(var i=0;i<results.length;i++){
                var venue = results[i].venue
                var lat = venue.location.lat
                var lng = venue.location.lng
                L.marker([lat, lng], {
                    icon: L.mapbox.marker.icon({
                        title:'test',
                        'marker-size': 'large',
                        'marker-symbol': 'cafe',
                        'marker-color': '#fa0'
                    })
                }).addTo(map);
            }
        }
    }
})