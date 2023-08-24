var inputSearch = document.getElementById("searchCity");
var searchSubmitButtonEl = document.getElementById("submitButton");
var recentCityEl = document.getElementById("recentCitySearches");
var inputFormEl = document.getElementById("inputForm");
var resultsPEl = document.getElementById("resultsPage")
var recentCitiesInStorage = localStorage.getItem("5DQV-Cities");
var recentsButtonElList = document.querySelectorAll(".recentCitiesButton");

var searchSubmitHandler = function () {

  if (inputSearch.value) {

    createSearchQuery(inputSearch.value);

  } else {

    console.log("null");

  }
}

var recentsClickHandler = function (citySelected) {

  createSearchQuery(citySelected);

};

var createSearchQuery = function (cityName) {

  var lat = 0;
  var lon = 0;
  var city = "";

  // convert city to coordinates by
  // making an api call to openweathermap's
  // geocoder api

  var apiGeo = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=34188d1321d0f8500a6319995d20223e";

  fetch(apiGeo)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {

          var cityLon = data[0].lon;
          var cityLat = data[0].lat;

          var apiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=34188d1321d0f8500a6319995d20223e&units=imperial";

          fetch(apiURL)
            .then(function (response) {
              if (response.ok) {
                response.json().then(function (weatherData) {

                  var todayDateObj = new Date;
                  var todayDate = "(" + todayDateObj.getMonth() + "/" + todayDateObj.getDate() + "/" + todayDateObj.getFullYear() + ")";

                  createWeatherCard(weatherData, todayDate);
                  saveCityToRecentSearches(cityName);

                  var apiURL5Day = "https://api.openweathermap.org/data/2.5/forecast?cnt=121&lat="+ cityLat + "&lon=" + cityLon + "&appid=34188d1321d0f8500a6319995d20223e&units=imperial";

                  // console.log(apiURL5Day);

                  fetch(apiURL5Day)

                    .then(function (response) {

                      if (response.ok) {

                        response.json().then(function (weatherForecastData) {
                          
                          
                          document.getElementById("fiveDayViewTitle").textContent = "5-Day Forecast:"
                          for (var i=1; i<6; i++) {

                            var nextDay = 8*i;

                            // var timestampUnix = weatherForecastData.list[8*i];
                            // console.log(convertUnixTimestamp(weatherForecastData.list[(8*i)][0]));
                            // 1692846000
                            // console.log(JSON.parse(weatherForecastData));
                            // console.log(weatherForecastData.list[0]);
                            // console.log(weatherForecastData.list[i].dt_txt);

                            create5DayWeatherCard(weatherForecastData.list[nextDay-1], i);

                          }
                          


                          // create5DayWeatherCard(forecastToShow);

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

// var recentsButtonClickHandler = function(event){
//   event.preventDefault;
//   console.log(this);  
// }

searchSubmitButtonEl.addEventListener('click', searchSubmitHandler);

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

  // console.log(forecastDataArray.name+ " " + forecastDay + " ");

  document.getElementById(pOfNameDate).textContent = forecastDataArray.dt_txt.slice(5,7)+"/"+forecastDataArray.dt_txt.slice(8,10)+"/"+forecastDataArray.dt_txt.slice(0,4);

  document.getElementById(pOfIcon).appendChild(weatherIcon);
  document.getElementById(pOfTemp).textContent = "Temp: " + forecastDataArray.main.temp + " ºF";
  document.getElementById(pOfWind).textContent = "Wind: " + forecastDataArray.wind.speed + " MPH";
  document.getElementById(pOfHumidity).textContent = "Humidity: " + forecastDataArray.main.humidity + " %";

}

if (recentCitiesInStorage) {
  displayRecents(JSON.parse(recentCitiesInStorage));
}

var convertUnixTimestamp = function(utcTime) {

  var unix_timestamp = utcTime;
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  console.log(formattedTime);
}