inputSearch = document.getElementById("searchQuery");
searchSubmitButtonEl = document.getElementById("submitButton");
recentCityEl = document.getElementById("recentCitySearches");

var searchSubmitHandler = function(event) {

    event.preventDefault();
    console.log('in submit');
    return;


}

var recentsClickHandler = function(event) {

    event.preventDefault();
    console.log('in recent cities');

}


searchSubmitButtonEl.addEventListener('submit', searchSubmitHandler);
recentCityEl.addEventListener('click', recentsClickHandler);