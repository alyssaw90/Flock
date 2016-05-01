$(function(){
    var map, myLayer, myLat, myLong
    var icons = {
        food:{title:'Food','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#fa0'},
        drinks:{title:'Drinks','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#0c0c2a'},
        coffee:{title:'Coffee','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#69675b'},
        outdoors:{title:'Outdoors','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#80a852'},
        shops:{title:'Shopping','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#f15a22'},
        here:{title:'You are here','marker-size': 'large','marker-symbol': 'star','marker-color': '#f00'}
    }
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
          .setView([lat, long], 16);
        L.marker([lat, long], {
            icon: L.mapbox.marker.icon(icons['here'])
        }).addTo(map);  
        
    }

    $("#food").click(function(){
        if(myLat&&myLong){
            search('food')
        }
    })
    $("#drinks").click(function(){
        if(myLat&&myLong){
            search('drinks')
        }
    })
    $("#coffee").click(function(){
        if(myLat&&myLong){
            search('coffee')
        }
    })
    $("#shops").click(function(){
        if(myLat&&myLong){
            search('shops')
        }
    })
    $("#outdoors").click(function(){
        if(myLat&&myLong){
            search('outdoors')
        }
    })
    $("#cultural").click(function(){
        if(myLat&&myLong){
            sg('concert')
            sg('theater')
            sg('classical')
            sg('classical_opera')
            sg('classical_vocal')
            sg('classical_orchestral_instrumental')
            sg('cirque_du_soleil')
            sg('broadway_tickets_national')
            sg('comedy')
            sg('family')
            sg('dance_performance_tour')
            sg('film')
            sg('literary')
            sg('circus')
        }
    })

    function search(type){
        $.get({
            url: '/api/search',
            data:{
                ll: myLat+","+myLong,
                type: type
            }
        }).done(function(response){
            addMarkers(response.results, type)
        })
    }

    function sg(type){
        $.get({
            url: '/api/sg',
            data:{
                ll: myLat+","+myLong,
                type: type
            }
        }).done(function(response){
            addMarkers(response.results, type)
        })
    }

    function addMarkers(results, type){
        if(results&&results.length){
            // var geoJson={
            //     type:'FeatureCollection',
            //     features:[]
            // }
            results.forEach(function(result){
                addMarker(result, type)
            })
        }
    }

    function addMarker(result, type){
        L.marker([result.lat, result.lon], {
            icon: L.mapbox.marker.icon(icons[type])
        }).addTo(map).on('click', function(e){
            //Here, we can do whatever we need with result
            //to show details, populate pop-up, whatever
            console.log(result)
        });
    }
})