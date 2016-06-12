$(function(){
    var googleKey = "AIzaSyAts9Pe6gW-RBOsCxYnZGTfX-kPJzSWfTU"
    var map, myLayer, homeMarker, 
        myLat, myLong, //actual coordinates of the user
        curLat, curLong, //coordinates of any updated search
        markers = []
    var icons = {
        food:{title:'Food','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#fa0'},
        drinks:{title:'Drinks','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#0c0c2a'},
        coffee:{title:'Coffee','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#69675b'},
        outdoors:{title:'Outdoors','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#80a852'},
        shops:{title:'Shopping','marker-size': 'large','marker-symbol': 'cafe','marker-color': '#f15a22'},
        here:{title:'You are here','marker-size': 'large','marker-symbol': 'star','marker-color': '#f00'}
    }

    initMap()
    getLocation()

    //get current geolocation
    function getLocation(){
        if(navigator && navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function success(position){
                myLat = position.coords.latitude
                myLong = position.coords.longitude
                setHome(myLat,myLong)
            }, function error(){

            })
        }else{
            $("#id").html("Geolocation not supported on this device")
        }
    }

    function initMap(){
        L.mapbox.accessToken = 'pk.eyJ1IjoidG9kZGJlc3QyMDA0IiwiYSI6ImNpbXhra2JsZjAzanh1d200aDB0cmI1Z3oifQ.ZVQ1Gg1zsOnYvud8rv4shA';
        map = L.mapbox.map('map', 'mapbox.streets')
    }


    $('#search-address').click(function(){
        var address = $('#address').val()
        searchLocation(address)
    })

    function searchLocation(address){
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+googleKey
        $.get({
            url:url
        }).done(function(res){
            var location = res.results[0].geometry.location
            var lat = location.lat
            var long = location.lng
            // initMap(lat,long)
            setHome(lat, long)
        })
    }

    function setHome(lat, long){
        curLat = lat
        curLong = long
        clearMarkers()
        map.setView([lat,long],16)
        if(homeMarker){
            map.removeLayer(homeMarker)
        }
        homeMarker = L.marker([lat, long], {
            icon: L.mapbox.marker.icon(icons['here'])
        }).addTo(map);
    }

    $("#food").click(function(){
        if(curLat&&curLong){
            search('food')
        }
    })
    $("#drinks").click(function(){
        if(curLat&&curLong){
            search('drinks')
        }
    })
    $("#coffee").click(function(){
        if(curLat&&curLong){
            search('coffee')
        }
    })
    $("#shops").click(function(){
        if(curLat&&curLong){
            search('shops')
        }
    })
    $("#outdoors").click(function(){
        if(curLat&&curLong){
            search('outdoors')
        }
    })
    $("#cultural").click(function(){
        if(curLat&&curLong){
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
                ll: curLat+","+curLong,
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
                ll: curLat+","+curLong,
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
        var marker = L.marker([result.lat, result.lon], {
            icon: L.mapbox.marker.icon(icons[type])
        }).addTo(map).on('click', function(e){
            //Here, we can do whatever we need with result
            //to show details, populate pop-up, whatever
            console.log(result)
        });
        markers.push(marker)
    }

    function clearMarkers(){
        markers.forEach(function(marker){
            map.removeLayer(marker)
        })
        markers=[]
    }

    // INTEREST MOBILE VIEW

    $('#interests').click(function(){
        // alert('interst button clicked!');
        $('.map-section').hide();
        $('.mobile-interests').show();
    });

    $('.backbutton').click(function(){
        $('.map-section').show();
        $('.mobile-interests').hide();
    })

    $(".circle").click(function(event){
        $(this).toggleClass("selected");
        $("#selectall").removeClass("hideselect");
        $("#selectall").addClass("showselect");
        $("#deselect").removeClass("showselect");
        $("#deselect").addClass("hideselect");

    });
    
    
    $("#selectall").click(function(event){
        $(".circle").addClass("selected");
        $("#selectall").addClass("hideselect");
        $("#selectall").removeClass("showselect");
        $("#deselect").addClass("showselect");
        $("#deselect").removeClass("hideselect");

    });

    
    $("#deselect").click(function(event){
        $(".circle").removeClass("selected");
        $("#selectall").removeClass("hideselect");
        $("#selectall").addClass("showselect");
        $("#deselect").removeClass("showselect");
        $("#deselect").addClass("hideselect");

    });

    //LOCATE BUTTON
    $('#locate').click(function(event){
        setHome(myLat, myLong);
    })
})