var inputSearch = document.getElementById("searchCity");
var searchSubmitButtonEl = document.getElementById("submitButton");
var recentCityEl = document.getElementById("recentCitySearches");
var inputFormEl = document.getElementById("inputForm");
var resultsPEl = document.getElementById("resultsPage")

var searchSubmitHandler = function() {

  if (inputSearch.value) {

      createSearchQuery(inputSearch.value);
  
  } else {
  
    console.log("null");
  
  }
  
  


   
    
}

var recentsClickHandler = function(event) {

    event.preventDefault();
    // console.log('in recent cities');

    createSearchQuery();

};

setInterval(function(){

    // update the weather report every 5 min
}, 300000);

var createSearchQuery = function(cityName){

    var lat = 0;
    var lon = 0;
    var city = "";

    // convet city to coordinates by
    // making an api call to openweathermap's
    // geocoder api
    // var apiGeo = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid='34188d1321d0f8500a6319995d20223e";

    var apiGeo = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=5&appid=34188d1321d0f8500a6319995d20223e";

    fetch(apiGeo)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {

            // console.log(data[0]);
            // console.log(data[0].lat);
            // console.log(data[0].lon);
            

            // var resultsPEl = document.createElement('p');
            // var mainPageEl = document.getElementById("panel-main");
        
            // console.log(data);
            var cityLon = data[0].lon;
            var cityLat = data[0].lat;

            var apiURL = "https://api.openweathermap.org/data/2.5/weather?lat="+cityLat+"&lon="+cityLon+"&appid=34188d1321d0f8500a6319995d20223e&units=imperial";

            // console.log(apiURL);

            fetch(apiURL)
            .then(function(response) {
              if (response.ok) {
                response.json().then(function(weatherData) {

                  var todayDateObj = new Date;
                  var todayDate = "("+todayDateObj.getMonth()+"/"+todayDateObj.getDate()+"/"+todayDateObj.getFullYear()+")";

                  // resolve the icon
                  var weatherIconHref = "https://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png";

                  console.log(todayDateObj);
                  console.log(todayDateObj.getMonth());
                  console.log(todayDateObj.getDate());
                  console.log(todayDateObj.getFullYear());
                  console.log(todayDate);
                  console.log(weatherData);
                  // resultsPEl.textContent = JSON.stringify(weatherData);
                  document.getElementById("currentCityNameDateIcon").textContent = weatherData.name+" "+todayDate+" ";

                  var weatherIcon = document.createElement("img");
                  weatherIcon.setAttribute("class","weatherIcon");
                  weatherIcon.setAttribute("alt","weather icon");
                  weatherIcon.setAttribute("src",weatherIconHref);

                  document.getElementById("currentCityNameDateIcon").appendChild(weatherIcon);


                  console.log(weatherIconHref);

                  document.getElementById("currentCityTemp").textContent = "Temp: "+weatherData.main.temp+" ºF";
                  
                  document.getElementById("currentCityWind").textContent = "Wind: "+weatherData.wind.gust+" MPH";
                  
                  document.getElementById("currentCityHumidity").textContent = "Humidity: "+weatherData.main.humidity+" %";

                })
              } else {
                alert('Error: ' + response.statusText);
              }
            })
            .catch(function (error) {
              alert('Unable to connect to OpenWeatherMap');
            });

            // for (var i=0; i<data.length; i++) {
        
            //     resultsPEl.textContent = data.current.temp;
            //     mainPageEl.appendChild(resultsPEl);
        
            // }

          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeatherMap');
      });
};

searchSubmitButtonEl.addEventListener('click', searchSubmitHandler);

// recentCityEl.addEventListener('click', recentsClickHandler);
