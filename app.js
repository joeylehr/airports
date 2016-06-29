var map;
var globalDepartureLongitude;
var globalDepartureLatitude;
var globalArrivalLongitude;
var globalArrivalLatitude;
var destinationMapsFormat;
var arrivalMapsFormat;
var google;
var maps;
var totalDifference;
var arrivalApiCoordinates;
var departureApiCoordinates;

// INITIALIZES GOOGLE MAP USING MOAT'S LOCATION :)
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.7434,
      lng: -73.9842
    },
    zoom: 17
  });
}

// REACTS TO USERS CHOICE OF 'SEARCH BY' TYPE BY 
// CORRESPONDING DISPLAYING INPUT FIELDS
document.addEventListener('DOMContentLoaded', function () {
  var citySearch = document.getElementById('city-search');
  var airportCodeSearch = document.getElementById('airport-code-search');
  var airportNameSearch = document.getElementById('airport-name-search');
  var searchType = document.getElementById("search-by-type");

  citySearch.style.display = "none"
  airportCodeSearch.style.display = "none"
  airportNameSearch.style.display = "none"

  searchType.addEventListener("change", function(){
    var searchChoice = this.value 

    if (searchChoice === "City") {
      citySearch.style.display = "block"
      airportCodeSearch.style.display = "none"
      airportNameSearch.style.display = "none"
    } else if (searchChoice === "Airport Code") {
      citySearch.style.display = "none"
      airportCodeSearch.style.display = "block"
      airportNameSearch.style.display = "none"
    } else {
      citySearch.style.display = "none"
      airportCodeSearch.style.display = "none"
      airportNameSearch.style.display = "block"
    }
  });
})

// ADJUSTS USER INPUT TO CORRECT SYNTAX
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// USED TO CALCULATE THE DISTANCE BW TWO LOCATIONS USING LAT AND LNG
 function calcHaversineDistance(lat1, lat2, long1, long2) {
    var radius = 6371
    var radianLat1 = toRadians(lat1);
    var radianLong1 = toRadians(long1);
    var radianLat2 = toRadians(lat2);
    var radianLong2 = toRadians(long2);
    var radianDistanceLat = radianLat1 - radianLat2;
    var radianDistanceLong = radianLong1 - radianLong2;
    var sinLat = Math.sin(radianDistanceLat / 2.0);
    var sinLong = Math.sin(radianDistanceLong / 2.0);
    var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLong, 2.0);
    var distance = radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
    return distance;
  }

  function toRadians(degree) {
    return (degree * (Math.PI / 180));
  }

// USES HAVERSINE'S FORMULA TO FIND THE DIFFERENCE B/W THE TWO POINTS
function callHaversineFormula(){
  setTimeout(function(){ 
    var a = calcHaversineDistance(globalDepartureLatitude, globalArrivalLatitude, globalDepartureLongitude, globalArrivalLongitude);
    a = (a * 0.53996).toFixed(2);
    document.getElementById('total-distance').innerHTML = "Total nautical miles: " + a;
  }, 0500)
}

// BELOW FUNCTION HITS GOOGLE API AND RETRIEVES LATITUDE AND
// LONGITUDE COORDINATES FOR THE DESTINATION INPUT AS WELL AS 
// ADDS THE USER'S INPUT TO THE SCREEN SO IT CAN BE VIEWED
// ALONG WITH THE LATITUDE AND LONGITUDE INFORMATION
function getDestinationCoordinates(destinationElementID, hiddenDestinationElementID){
  (function hitDestinationApi(){
    document.getElementById(destinationElementID).innerHTML = "";
    document.getElementById(hiddenDestinationElementID).innerHTML = "";
    globalArrivalLatitude = "";
    globalArrivalLongitude = "";
    $.ajax({
      method: 'GET',
      // NEED TO CALL SLICE ON DESTINATION NAME AS THE AIRPORT CODE SOME TIMES MESS UP API RETURN
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destinationMapsFormat + '&key=AIzaSyAYdo1wPD2kjB_k6gQElqL8IdFbuHPBs-0'
    }).then(function(data){
      globalDepartureLatitude = data.results[0].geometry.location.lat;
      globalDepartureLongitude = data.results[0].geometry.location.lng;
      document.getElementById(destinationElementID).innerHTML += ("<strong>" + destinationMapsFormat +": "+ "<br>" + "Lat: " + globalDepartureLatitude.toFixed(4) +", " + "Lng: " + globalDepartureLongitude.toFixed(4) + "</strong>");
      document.getElementById(hiddenDestinationElementID).innerHTML += (globalDepartureLatitude + " " + globalDepartureLongitude);
    });
  }());
}

// BELOW FUNCTION HITS GOOGLE API AND RETRIEVES LATITUDE AND
// LONGITUDE COORDINATES FOR THE ARRIVAL INPUT AS WELL AS 
// ADDS THE USER'S INPUT TO THE SCREEN SO IT CAN BE VIEWED
// ALONG WITH THE LATITUDE AND LONGITUDE INFORMATION
function getArrivalCoordinates(arrivalElementID, hiddenArrivalElementID){
  (function hitArrivalApi(){
    document.getElementById(arrivalElementID).innerHTML = "";
    document.getElementById(hiddenArrivalElementID).innerHTML = "";
    globalArrivalLatitude = "";
    globalArrivalLongitude = "";
    $.ajax({
      method: 'GET',
      // NEED TO CALL SLICE ON ARRIVAL NAME AS THE AIRPORT CODE SOME TIMES MESS UP API RETURN
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + (arrivalMapsFormat.slice(0,-3)) + '&key=AIzaSyAYdo1wPD2kjB_k6gQElqL8IdFbuHPBs-0'
    }).then(function(data){
        globalArrivalLatitude = data.results[0].geometry.location.lat;
        globalArrivalLongitude = data.results[0].geometry.location.lng;
        document.getElementById(arrivalElementID).innerHTML += ("<strong>" + arrivalMapsFormat + ": " + "<br >" + "Lat: " + globalArrivalLatitude.toFixed(4) +", " + "Lng: " + globalArrivalLongitude.toFixed(4) + "</strong>");
        document.getElementById(hiddenArrivalElementID).innerHTML += (globalArrivalLatitude + " " + globalArrivalLongitude);
      });
  }());
}


// USES GOOGLE API TO MARK THE USER'S TWO SELECTED POINTS ONTO THE MAP
function googleMapSetter(){
  setTimeout(function(){
    (function initMap() {
      var departureMarker = {
        info: destinationMapsFormat,
        lat: globalDepartureLatitude,
        long: globalDepartureLongitude
      };

      var arrivalMarker = {
      info: arrivalMapsFormat,
      lat: globalArrivalLatitude.toFixed(4),
      long: globalArrivalLongitude.toFixed(4)
      };

      var locations = [
        [departureMarker.info, departureMarker.lat, departureMarker.long, 0],
        [arrivalMarker.info, arrivalMarker.lat, arrivalMarker.long, 1],
      ];

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: new google.maps.LatLng(39.50, -98.35),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infowindow = new google.maps.InfoWindow({});

      var marker, i;

      for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
          return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
          }
        })(marker, i));
      } 
    }())
  }, 0501)
}
