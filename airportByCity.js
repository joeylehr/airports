// ADDS THE SEED DATA FOR AIRPORT CITY CATEGORY CHOICE FOR AIRPORT SELECTION
document.addEventListener('DOMContentLoaded', function () {
  var addIt = document.querySelector(".search-info-by-city #airport-dropdown-by-city")
  _.each(airportsByCity, function(airportName, city) {
    var airport = document.createElement("option")
    addIt.innerHTML += "<option value = '" + city + "'>" + airportName + "</option>";
  });
});

// ADDS EVENT LISTENER TO PULL USERS INPUT THEN RUNS SEVERAL FUNCTIONS
// TO RETURN INFORMATION ON THE TWO LOCATIONS AND MAP THEM
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('city-search-button').addEventListener("click", function(){
    var departureEntry = document.getElementById('city-search-destination-input');
    var arrivalEntry = document.getElementById('city-search-arrival-input');
    var departureEntrySyntaxFixer = toTitleCase(departureEntry.value);
    var arrivalEntrySyntaxFixer = toTitleCase(arrivalEntry.value);
    // TWO GLOBAL VARIABLES BELOW 
    destinationMapsFormat = airportsByCity[departureEntrySyntaxFixer];
    arrivalMapsFormat = airportsByCity[arrivalEntrySyntaxFixer];
    departureEntry.value = "";
    arrivalEntry.value = "";

    // IF USER INPUT IS INVALID AN ALERT WILL APPEAR AND PREVENT THE REST OF THE FUNCTIONS FROM RUNNING
    if (typeof(destinationMapsFormat) === "undefined" || typeof(arrivalMapsFormat) === "undefined" ){
      alert("Please enter a valid airport name");
      return
    };
    
    // HAD TO USE SLICE METHOD TO MAKE SURE THE INFO IS PASSING CORRECTLY INTO
    // THE API (AVOIDS BUGS) WITHIN FUNCTION SO DECIDED TO WRITE OUT ENTIRE
    // FUNCTION INSTEAD OF STICKING TO D.R.Y. and USING 'getDestinationCoordinates'
    (function hitDestinationApi(){
      document.getElementById('city-destination-coordinates').innerHTML = "";
      document.getElementById('city-hidden-arrival-coordinates').innerHTML = "";
      globalArrivalLatitude = "";
      globalArrivalLongitude = "";
      $.ajax({
        method: 'GET',
        // NEED TO CALL SLICE ON DESTINATION NAME AS THE AIRPORT CODE SOME TIMES MESS UP API RETURN
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + (destinationMapsFormat.slice(0,-3)) + '&key=AIzaSyAYdo1wPD2kjB_k6gQElqL8IdFbuHPBs-0'
      }).then(function(data){
        globalDepartureLatitude = data.results[0].geometry.location.lat;
        globalDepartureLongitude = data.results[0].geometry.location.lng;
        document.getElementById('city-destination-coordinates').innerHTML += ("<strong>" + destinationMapsFormat +": "+ "<br>" + "Lat: " + globalDepartureLatitude.toFixed(4) +", " + "Lng: " + globalDepartureLongitude.toFixed(4) + "</strong>");
        document.getElementById('city-hidden-destination-coordinates').innerHTML += (globalDepartureLatitude + " " + globalDepartureLongitude);
      });
    }());

    getArrivalCoordinates('city-arrival-coordinates', 'city-hidden-arrival-coordinates');
    callHaversineFormula();
    googleMapSetter();

  });
})
