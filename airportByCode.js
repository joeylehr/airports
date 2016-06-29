// ADDS THE SEED DATA FOR AIRPORT CODE CATEGORY CHOICE FOR AIRPORT SELECTION
document.addEventListener('DOMContentLoaded', function () {
  var addIt = document.querySelector(".search-info-by-code #airport-dropdown-by-code")
  _.each(airportsByCode, function(city, airportCode) {
    var airport = document.createElement("option")
    addIt.innerHTML += "<option value = '" + airportCode + "'>" + city + "</option>";
  });
});

// ADDS EVENT LISTENER TO PULL USERS INPUT THEN RUNS SEVERAL FUNCTIONS
// TO RETURN INFORMATION ON THE TWO LOCATIONS AND MAP THEM
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('airport-code-search-button').addEventListener("click", function(){
    var departureEntry = document.getElementById('airport-code-search-destination-input');
    var arrivalEntry = document.getElementById('airport-code-search-arrival-input');
    var departureEntrySyntaxFixer = (departureEntry.value).toUpperCase();
    var arrivalEntrySyntaxFixer = (arrivalEntry.value).toUpperCase();
    // TWO GLOBAL VARIABLES BELOW    
    destinationMapsFormat = airportsByCode[departureEntrySyntaxFixer];
    arrivalMapsFormat = airportsByCode[arrivalEntrySyntaxFixer];
    departureEntry.value = "";
    arrivalEntry.value = "";

    // IF USER INPUT IS INVALID AN ALERT WILL APPEAR
    if (typeof(destinationMapsFormat) === "undefined" || typeof(arrivalMapsFormat) === "undefined" ){
      alert("Please enter a valid airport name");
      return
    };
    
    getDestinationCoordinates('code-destination-coordinates', 'code-hidden-destination-coordinates');
    getArrivalCoordinates('code-arrival-coordinates', 'code-hidden-arrival-coordinates');
    callHaversineFormula();
    googleMapSetter();

  })
})