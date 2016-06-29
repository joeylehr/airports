// ADDS THE SEED DATA FOR AIRPORT NAME CATEGORY CHOICE FOR AIRPORT SELECTION
document.addEventListener('DOMContentLoaded', function () {
  var addIt = document.querySelector(".search-info-by-name #airport-dropdown-by-name")
  _.each(airportsByName, function(city, airportName) {
    var airport = document.createElement("option")
    addIt.innerHTML += "<option value = '" + airportName + "'>" + city + "</option>";
  });
});

// ADDS EVENT LISTENER TO PULL USERS INPUT THEN RUNS SEVERAL FUNCTIONS
// TO RETURN INFORMATION ON THE TWO LOCATIONS AND MAP THEM
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('airport-name-search-button').addEventListener("click", function(){
    var departureEntry = document.getElementById('airport-name-search-destination-input');
    var arrivalEntry = document.getElementById('airport-name-search-arrival-input');
    var destinationChecker = airportsByName[(departureEntry.value)];
    var arrivalChecker = airportsByName[(arrivalEntry.value)];
    // TWO GLOBAL VARIABLES BELOW
    destinationMapsFormat = toTitleCase(departureEntry.value);
    arrivalMapsFormat = toTitleCase(arrivalEntry.value);
    departureEntry.value = "";
    arrivalEntry.value = "";

    // IF USER INPUT IS INVALID AN ALERT WILL APPEAR AND PREVENT THE REST OF THE FUNCTIONS FROM RUNNING
    if (typeof(destinationChecker) === "undefined" || typeof(arrivalChecker) === "undefined" ){
      alert("Please enter a valid airport name");
      return
    };

    getDestinationCoordinates('name-destination-coordinates', 'name-hidden-destination-coordinates');
    getArrivalCoordinates('name-arrival-coordinates', 'name-hidden-arrival-coordinates');
    callHaversineFormula()
    googleMapSetter();

  })
})
