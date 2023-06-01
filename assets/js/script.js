var openWeatherApiKey = "2b3779879120029e8605b621670c608a";
var openWeatherCoordsUrl = "http://api.openweathermap.org/geo/1.0/direct?q";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?";
var userSearch = $("#searchBox");
var column2El = $(".column2");
var cityInputEl = $("#city");
var fiveDayEl = $("#fiveDay");
var searchHistory = $("#searchHistory");
var presentDay = moment().format("M/DD/YYYY");
var searchHistoryArray = loadSearchHistory();

function loadSearchHistory() {
  var searchHistoryArray = JSON.parse(localStorage.getItem("search history"));

  if (!searchHistoryArray) {
    searchHistoryArray = {
      searchedCity: [],
    };
  } else {
    for (var i = 0; i < searchHistoryArray.searchedCity.length; i++) {
      searchHistory(searchHistoryArray.searchedCity[i]);
    }
  }
  return searchHistoryArray;
}

function saveSearchHistory() {
  localStorage.setItem("search history", JSON.stringify(saveSearchHistory));
}

function searchHistory(city) {
  var searchHistoryBtn = $("<button>")
    .addClass("btn")
    .text(city)
    .on("click", function () {
      $("#currentWeather").remove();
      $("#fiveDay").empty();
      $("#fiveDayHeader").remove();
      getWeather(city);
    })
    .attr({
      type: "button",
    });
  searchHistory.append(searchHistoryBtn);
}

function getWeather(city) {
  var apiCoordsUrl =
    openWeatherCoordsUrl + city + "&appid=" + openWeatherApiKey;
}
