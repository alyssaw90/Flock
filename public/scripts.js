$(function(){
    var googleKey = "AIzaSyAts9Pe6gW-RBOsCxYnZGTfX-kPJzSWfTU"
    var map, myLayer, homeMarker, 
        myLat, myLong, //actual coordinates of the user
        curLat, curLong, //coordinates of any updated search
        markers={food:[],drinks:[],shops:[],coffee:[],outdoors:[],cultural:[]}
    var popupImage;
    var icons = {
        here:{title:'You are here','marker-size': 'large','marker-symbol': 'star','marker-color': '#f00'}
    }

    var iconUrls = {
        food:'/img/burger-icon.png',
        drinks: '/img/happyhour-icon.png',
        coffee: '/img/coffee-icon.png',
        outdoors: '/img/outdoors-icon.png',
        shops: '/img/shopping-icon.png',
        cultural: '/img/culture-icon.png'
    }

    var toggles = {
        food: false,
        drinks: false,
        coffee: false,
        outdoors: false,
        shops: false,
        cultural: false,
    }

    var searches = {
        food: function(){fs('food')},
        drinks: function(){fs('drinks')},
        coffee: function(){fs('coffee')},
        outdoors: function(){fs('outdoors')},
        shops: function(){fs('shops')},
        cultural: function(){sg('concert','cultural')
            sg('theater','cultural')
            sg('classical','cultural')
            sg('classical_opera','cultural')
            sg('classical_vocal','cultural')
            sg('classical_orchestral_instrumental','cultural')
            sg('cirque_du_soleil','cultural')
            sg('broadway_tickets_national','cultural')
            sg('comedy','cultural')
            sg('family','cultural')
            sg('dance_performance_tour','cultural')
            sg('film','cultural')
            sg('literary','cultural')
            sg('circus','cultural')}
    }

    initMap()
    clearMarkers()
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

    function toggle(type){
        if(!curLat||!curLong){
            return
        }
        if(toggles[type]){
            toggles[type]=false
            clearMarkerType(type)
        }else{
            toggles[type]=true
            if(searches[type]){
                searches[type]()
            }
        }
    }

    $("#food").click(function(){
        toggle('food')
    })
    $("#drinks").click(function(){
        toggle('drinks')
    })
    $("#coffee").click(function(){
        toggle('coffee')
    })
    $("#shops").click(function(){
        toggle('shops')
    })
    $("#outdoors").click(function(){
        toggle('outdoors')
    })
    $("#cultural").click(function(){
        toggle('cultural')
    })

    function fs(type){
        $.get({
            url: '/api/search',
            data:{
                ll: curLat+","+curLong,
                type: type,
                timestamp: new Date()
            }
        }).done(function(response){
            addMarkers(response.results, type)
        })
    }

    function sg(type, mainType){
        $.get({
            url: '/api/sg',
            data:{
                ll: curLat+","+curLong,
                type: type
            }
        }).done(function(response){
            addMarkers(response.results, mainType)
        })
    }

    function addMarkers(results, type){
        if(results&&results.length){
            // var geoJson={
            //     type:'FeatureCollection',
            //     features:[]
            // }
            results.forEach(function(result){
                console.log(result)
                addMarker(result, type)
            })
        }
    }

    function addMarker(result, type){
        console.log(type)
        var marker = L.marker([result.lat, result.lon])
        marker.setIcon(L.icon({
          "iconUrl": iconUrls[type],
          "iconSize": [50, 50], // size of the icon
          "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
          "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
          "className": "dot"
        }))
        marker.addTo(map)
        marker.on('click', function(e){
            //Here, we can do whatever we need with result
            //to show details, populate pop-up, whatever
            console.log(result);
            console.log(type);
            // alert(result.name)


            if (type === 'food') {
                popupImage = '/img/burger-icon.png';
            } else if (type === 'drinks') {
                popupImage = '/img/happyhour-icon.png'
            } else if (type === 'coffee') {
                popupImage = '/img/coffee-icon.png'
            } else if (type === 'outdoors') {
                popupImage = '/img/outdoors-icon.png'
            } else if (type === 'shops') {
                popupImage = '/img/shopping-icon.png'
            } else if (type === 'cultural') {
                popupImage = '/img/culture-icon.png'
            } else {
                popupImage = '/img/Flock-logo1.png'
            }
            swal({   
                title: result.name,   
                text: result.address + '\n' + result.hours.status,   
                imageUrl: popupImage,
                confirmButtonText: "Cool" 
            });
        });

        markers[type].push(marker)
    }

    function clearMarkers(){
        for(type in markers){
            clearMarkerType(type)
        }
    }

    function clearMarkerType(type){
        if(markers[type]){
            markers[type].forEach(function(marker){
                map.removeLayer(marker)
            })
            markers[type]=[]
        }
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
        toggle($(this).data('type'))
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