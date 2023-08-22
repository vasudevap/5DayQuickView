inputSearch = document.getElementById("searchQuery");
searchSubmitButtonEl = document.getElementById("submitButton");
recentCityEl = document.getElementById("recentCitySearches");

var searchSubmitHandler = function(event) {

    event.preventDefault();
    // console.log('in submit');
   
    var searchResults = createSearchQuery();

   
    
}

var recentsClickHandler = function(event) {

    event.preventDefault();
    console.log('in recent cities');

};

setInterval(function(){

    // update the weather report every 5 min
}, 300000);

var createSearchQuery = function(){

    var lat = 0;
    var lon = 0;
    var city = "";

    // convet city to coordinates by
    // making an api call to openweathermap's
    // geocoder api
    // var apiGeo = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid='34188d1321d0f8500a6319995d20223e";

    var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid=34188d1321d0f8500a6319995d20223e";

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {

            var resultsPEl = document.createElement('p');
            var mainPageEl = document.getElementById("panel-main");
        
            for (var i=0; i<data.length; i++) {
        
                resultsPEl.textContent = data.current.temp;
                mainPageEl.appendChild(resultsPEl);
        
            }

          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeatherMap');
      });
};

searchSubmitButtonEl.addEventListener('submit', searchSubmitHandler);

recentCityEl.addEventListener('click', recentsClickHandler);