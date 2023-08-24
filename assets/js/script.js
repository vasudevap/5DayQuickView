var inputSearch = document.getElementById("searchCity");
var searchSubmitButtonEl = document.getElementById("submitButton");
var recentCityEl = document.getElementById("recentCitySearches");
var inputFormEl = document.getElementById("inputForm");
var resultsPEl = document.getElementById("resultsPage")
var recentCitiesInStorage = localStorage.getItem("5DQV-Cities");
var recentsButtonElList = document.querySelectorAll(".recentCitiesButton");

// handle event when city is searched for in input field
var searchSubmitHandler = function () {

  if (inputSearch.value) {

    getWeatherData(inputSearch.value);

  } else {

    console.log("null");

  }
}
// handle event when recent cities is clicked
var recentsClickHandler = function (citySelected) {

  getWeatherData(citySelected);

};
// create search query and connect with api
var getWeatherData = function (cityName) {

  var lat = 0;
  var lon = 0;
  var city = "";

  // convert city to coordinates by
  // making an api call to openweathermap's
  // geocoder api

  var apiGeo = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=34188d1321d0f8500a6319995d20223e";
  
  // get coordinates of city searched from input field
  fetch(apiGeo)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {

          // capture cities coordinates
          var cityLon = data[0].lon;
          var cityLat = data[0].lat;

          var apiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=34188d1321d0f8500a6319995d20223e&units=imperial";
          
          // get weather data for city using coordinates just obtained
          fetch(apiURL)
            .then(function (response) {
              if (response.ok) {
                response.json().then(function (weatherData) {

                  // create today's date
                  var todayDateObj = new Date;
                  var todayDate = "(" + todayDateObj.getMonth() + "/" + todayDateObj.getDate() + "/" + todayDateObj.getFullYear() + ")";

                  // add weather information to the current weather up top
                  createWeatherCard(weatherData, todayDate);

                  // save or refresh searched city in localStorage
                  saveCityToRecentSearches(cityName);

                  // get 5-day forecast
                  var apiURL5Day = "https://api.openweathermap.org/data/2.5/forecast?cnt=121&lat="+ cityLat + "&lon=" + cityLon + "&appid=34188d1321d0f8500a6319995d20223e&units=imperial";

                  fetch(apiURL5Day)

                    .then(function (response) {

                      if (response.ok) {

                        response.json().then(function (weatherForecastData) {
                          
                          
                          document.getElementById("fiveDayViewTitle").textContent = "5-Day Forecast:"
                          for (var i=1; i<6; i++) {

                            // weather data gives updates every 3 hours, so 
                            // 1 day is 24hours/3hours = 8
                            var nextDay = 8*i;

                            // render 5 day weather (1 day at a time in this loop)
                            create5DayWeatherCard(weatherForecastData.list[nextDay-1], i);

                          }

                        })

                      } else {

                        alert("bad response: "+response.statusText);

                      }

                    });

                });
              } else {
                alert('Error: ' + response.statusText);
              }
            })
            .catch(function (error) {
              alert('Unable to connect to OpenWeatherMap');
            });

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeatherMap');
    });
};
// for rendering current weather up top
var createWeatherCard = function (weatherData, forDate) {

  // resolve the icon
  var weatherIconHref = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";

  document.getElementById("currentCityNameDateIcon").textContent = weatherData.name + " " + forDate + " ";

  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute("class", "weatherIcon");
  weatherIcon.setAttribute("alt", "weather icon");
  weatherIcon.setAttribute("src", weatherIconHref);

  document.getElementById("currentCityNameDateIcon").appendChild(weatherIcon);
  document.getElementById("currentCityTemp").textContent = "Temp: " + weatherData.main.temp + " ºF";
  document.getElementById("currentCityWind").textContent = "Wind: " + weatherData.wind.speed + " MPH";
  document.getElementById("currentCityHumidity").textContent = "Humidity: " + weatherData.main.humidity + " %";

}
// for saving or refreshing city searched to the localStorage
var saveCityToRecentSearches = function (cityName) {

  var recentsArray = localStorage.getItem("5DQV-Cities");

  if (recentsArray) {

    // recents has cities saved already
    recentsArray = JSON.parse(recentsArray);

    if (recentsArray.indexOf(cityName) >= 0) {
      // recents has this particular city
      // and indexOfCity has array index

      // remove cityName element from the array
      recentsArray = recentsArray.toSpliced(recentsArray.indexOf(cityName), 1);

      // add cityName to the beginning of the array
      recentsArray.unshift(cityName);

    } else {

      // recents does not have this city in it
      // so save it to the top position in recents
      recentsArray.unshift(cityName);
      // set max limit of recent cities storage to 8
      while (recentsArray.length>8) {
        recentsArray.pop();
      };
    }

  } else {

    // no recent cities found in localstorage,
    // so save one
    recentsArray = [cityName];

  }

  // save to localStorage
  localStorage.setItem("5DQV-Cities", JSON.stringify(recentsArray));

  // update the recent cities display
  displayRecents(recentsArray);

};
// for displaying recent cities on the page
var displayRecents = function (recentsArrayToDisplay) {

  var recentsContainer = document.getElementById("recentCitySearches");
  recentsContainer.innerHTML = "";

  for (var i = 0; i < recentsArrayToDisplay.length; i++) {

    // display recent cities
    var buttonEl = document.createElement("button");
    buttonEl.setAttribute("class", "recentCitiesButton");
    buttonEl.setAttribute("type", "button");
    buttonEl.setAttribute("name", recentsArrayToDisplay[i]);
    buttonEl.setAttribute("value", recentsArrayToDisplay[i]);
    buttonEl.textContent = recentsArrayToDisplay[i];

    recentsContainer.appendChild(buttonEl);

  }
}
// for displaying forecast for one day
// forecastDay is a value between 1 and 5
// forecastDataArray is forecast data for 1 day
var create5DayWeatherCard = function (forecastDataArray, forecastDay) {

  // console.log(forecastDataArray);

  // resolve the icon
  var weatherIconHref = "https://openweathermap.org/img/wn/" + forecastDataArray.weather[0].icon + "@2x.png";

  // create Id for HTML elements to get
  var divIdOfCard = "Day"+forecastDay+"Weather";
  var pOfNameDate = divIdOfCard+"NameDate";
  var pOfIcon = divIdOfCard+"Icon";
  var pOfTemp = divIdOfCard+"Temp";
  var pOfWind = divIdOfCard+"Wind";
  var pOfHumidity = divIdOfCard+"Humidity";

  var weatherIcon = document.createElement("img");

  weatherIcon.setAttribute("class", "weatherIcon");
  weatherIcon.setAttribute("alt", "weather icon");
  weatherIcon.setAttribute("src", weatherIconHref);

  document.getElementById(pOfNameDate).textContent = forecastDataArray.dt_txt.slice(5,7)+"/"+forecastDataArray.dt_txt.slice(8,10)+"/"+forecastDataArray.dt_txt.slice(0,4);
  document.getElementById(pOfIcon).innerHTML="";
  document.getElementById(pOfIcon).appendChild(weatherIcon);
  document.getElementById(pOfTemp).textContent = "Temp: " + forecastDataArray.main.temp + " ºF";
  document.getElementById(pOfWind).textContent = "Wind: " + forecastDataArray.wind.speed + " MPH";
  document.getElementById(pOfHumidity).textContent = "Humidity: " + forecastDataArray.main.humidity + " %";

}
// when page loads, print recent cities from localStorage
if (recentCitiesInStorage) {
  displayRecents(JSON.parse(recentCitiesInStorage));
}
// this is kicked off if the submit button is clicked
searchSubmitButtonEl.addEventListener('click', searchSubmitHandler);
// this is kicked off when one of the recent cities is clicked
recentCityEl.addEventListener('click', function (event) {

  event.preventDefault;
  // console.log(event.target);

  // //if button.name is one of the cities
  // if (event.target.name === "berlin"){
  // }

  if (recentCitiesInStorage.indexOf(event.target.name) >= 0) {
    // a city was clicked from history
    recentsClickHandler(event.target.name);
  }

});