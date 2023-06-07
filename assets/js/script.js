var openWeatherApiKey = "2b3779879120029e8605b621670c608a";
var openWeatherCoordsUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?";
var apiDailyUrl = "https://api.openweathermap.org/data/2.5/weather?";
var userSearch = $("#searchBox");
var column2El = $(".column2");
var cityInputEl = $("#city");
var fiveDayEl = $("#fiveDay");
var dailyEl = $("#daily");
var searchHistory = $("#searchHistory");
var presentDay = moment().format("M/DD/YYYY");
var searchHistoryArray = loadSearchHistory();

function loadSearchHistory() {
  var searchHistoryArray = localStorage.getItem("search history");
  if (searchHistoryArray) {
    searchHistoryArray = JSON.parse(searchHistoryArray);
    for (var i = 0; i < searchHistoryArray.searchedCity.length; i++) {
      searchHistoryFunc(searchHistoryArray.searchedCity[i]);
    }
  } else {
    // console.log(searchHistoryArray);
    searchHistoryArray = {
      searchedCity: [],
    };
  }
  return searchHistoryArray;
}

function saveSearchHistory() {
  localStorage.setItem("search history", JSON.stringify(searchHistoryArray));
}

function searchHistoryFunc(city) {
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
  fetch(apiCoordsUrl)
    .then(function (coordResponse) {
      return coordResponse.json();
    })
    .then(function ([data]) {
      // console.log(data);
      var cityLat = data.lat;
      var cityLong = data.lon;
      getDailyForcast(cityLat, cityLong);
      // fiveDayForcast(cityLat, cityLong)
    })
    .catch(function (error) {
      console.log(error);
    });
  // {
  //   alert("Cannot connect to Open Weather");
  // }
}
function getDailyForcast(cityLat, cityLong) {
  var url =
    apiDailyUrl +
    "lat=" +
    cityLat +
    "&lon=" +
    cityLong +
    "&appid=" +
    openWeatherApiKey;
  fetch(url)
    .then(function (weatherAnswer) {
      // if (weatherAnswer.ok) {
      return weatherAnswer.json();
    })
    .then(function (weatherData) {
      console.log(weatherData);
    });
}

function fiveDayForcast(lat, lon) {
  $("#fiveDay").before(currentWeather);

  var fiveDayArray = [];
  for (var i = 0; i < 5; i++) {
    let forcastDay = moment()
      .add(i + 1, "days")
      .format("M/DD/YYYY");
    fiveDayArray.push(forcastDay);
  }
  for (var i = 0; i < fiveDayArray.length; i++) {
    var cardDiv = $("<div>").addClass("col3");
    var cardBody = $("<div>").addClass("card-body");
    var cardTitle = $("<h3>").addClass("card-title").text(fiveDayArray);
    var currentWeatherDetails = [
      "Temp: " + weatherData.current.temp + " °F",
      "Wind: " + weatherData.current.wind_speed + " MPH",
      "Humidity: " + weatherData.current.humidity + "%",
    ];
    var temp = $("<p>")
      .addClass("card-text")
      .text("Temp: " + weatherData.daily[i].temp.max);
    var wind = $("<p>")
      .addClass("card-text")
      .text("Wind: " + weatherData.daily[i].wind_speed + "MPH");
    var humidity = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + weatherData.daily[i].humidity + "%");
    fiveDayEl.append(cardDiv);
    cardDiv.append(cardBody);
    cardBody.append(cardTitle);
    cardBody.append(temp);
    cardBody.append(wind);
    cardBody.append(humidity);
  }
  // }
  // });
}
// function sumbitCitySearch(e) {
//   e.preventDefault();
// }

// userSearch.on("submit", sumbitCitySearch);

$("#searchBtn").on("click", function (e) {
  e.preventDefault();
  $("#currentWeather").remove();
  $("#fiveDay").empty();

  var city = cityInputEl.val().trim();
  if (searchHistoryArray.searchedCity.includes(city)) {
    alert(city + " is already in history.");
  } else if (city) {
    getWeather(city);
    searchHistoryFunc(city);
    searchHistoryArray.searchedCity.push(city);
    saveSearchHistory();
    cityInputEl.val(" ");
  } else {
    alert("Please enter valid city");
  }
});
