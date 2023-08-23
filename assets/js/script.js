var inputSearch = document.getElementById("searchCity");
var searchSubmitButtonEl = document.getElementById("submitButton");
var recentCityEl = document.getElementById("recentCitySearches");
var inputFormEl = document.getElementById("inputForm");
var resultsPEl = document.getElementById("resultsPage")
var recentCitiesInStorage = localStorage.getItem("5DQV-Cities");

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

var createSearchQuery = function(cityName){

    var lat = 0;
    var lon = 0;
    var city = "";

    // convert city to coordinates by
    // making an api call to openweathermap's
    // geocoder api
    
    var apiGeo = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=5&appid=34188d1321d0f8500a6319995d20223e";

    fetch(apiGeo)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {

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

                  createWeatherCard(weatherData, todayDate);
                  saveCityToRecentSearches(cityName);

                })
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

var createWeatherCard = function(weatherData, forDate) {

  // resolve the icon
  var weatherIconHref = "https://openweathermap.org/img/wn/"+weatherData.weather[0].icon+"@2x.png";

  document.getElementById("currentCityNameDateIcon").textContent = weatherData.name+" "+forDate+" ";

  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute("class","weatherIcon");
  weatherIcon.setAttribute("alt","weather icon");
  weatherIcon.setAttribute("src",weatherIconHref);

  document.getElementById("currentCityNameDateIcon").appendChild(weatherIcon);


  console.log(weatherIconHref);

  document.getElementById("currentCityTemp").textContent = "Temp: "+weatherData.main.temp+" ºF";
  
  document.getElementById("currentCityWind").textContent = "Wind: "+weatherData.wind.speed+" MPH";
  
  document.getElementById("currentCityHumidity").textContent = "Humidity: "+weatherData.main.humidity+" %";

}

var saveCityToRecentSearches = function(cityName){

  var recentsArray = localStorage.getItem("5DQV-Cities");

  if(recentsArray) {

    // recents has cities saved already
    recentsArray = JSON.parse(recentsArray);
      
    if(recentsArray.indexOf(cityName)>=0) {
      // recents has this particular city
      // and indexOfCity has array index
      
      // remove cityName element from the array
      recentsArray = recentsArray.toSpliced(recentsArray.indexOf(cityName),1);

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
  localStorage.setItem("5DQV-Cities",JSON.stringify(recentsArray));
  
  // update the recent cities display
  displayRecents(recentsArray);

};

var displayRecents = function(recentsArrayToDisplay){

  var recentsContainer = document.getElementById("recentCitySearches");

  console.log(recentsContainer);
  console.log(recentsContainer.length);

  // recentsContainer

  // console.log("starting:");
  // console.log(recentsContainer);

  // if (recentsContainer.children.length) {
  //   // recents already has cities showing in it
  //   // so clear the area and redraw
  //   console.log("yes, length exists of: "+recentsContainer.children.length);
  //   console.log(recentsContainer);
  //   for (var i=0; i<recentsContainer.children.length, i++;) {
  //     console.log("removing "+.getAttribute("type"));
  //     recentsContainer.children[0].remove();
  //   }
  //   console.log("removed them - container is now: ");
  //   console.log(recentsContainer);
  // }



  for (var i=0; i<recentsArrayToDisplay.length; i++) {
    // display recent cities
    var buttonEl = document.createElement("button");
    buttonEl.setAttribute("class", "recentCitiesButton");
    buttonEl.setAttribute("type", "button");
    buttonEl.setAttribute("name", recentsArrayToDisplay[i]);
    buttonEl.setAttribute("value", recentsArrayToDisplay[i]);

    recentsContainer.appendChild(buttonEl);

  }


}

searchSubmitButtonEl.addEventListener('click', searchSubmitHandler);

if (recentCitiesInStorage) {
  displayRecents(JSON.parse(recentCitiesInStorage));
}