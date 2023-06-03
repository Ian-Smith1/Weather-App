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
  fetch(apiCoordsUrl).then(function (coordResponse) {
    if (coordResponse.ok) {
      coordResponse.JSON().then(function (data) {
        var cityLat = data.coord.lat;
        var cityLong = data.coord.lon;
        var apiOneCall =
          apiUrl +
          cityLat +
          "&lon=" +
          cityLong +
          "&appid" +
          openWeatherApiKey +
          "&units=imperial";
        fetch(apiOneCall).then(function (weatherAnswer) {
          if (weatherAnswer.ok) {
            weatherAnswer.JSON().then(function (weatherData) {
              var currentWeather = $("<div>").attr({
                id: "currentWeather",
              });
              var currentWeatherHeader = $("<h2>").text(city + currentDay);
              var currentWeatherList = $("<ul>");

              var currentWeatherDetails = [
                "Temp: " + weatherData.current.temp + " °F",
                "Wind: " + weatherData.current.wind_speed + " MPH",
                "Humidity: " + weatherData.current.humidity + "%",
                "UV Index: " + weatherData.current.uvi,
              ];
              for (var i = 0; i < currentWeatherDetails.length; i++) {
                if (
                  currentWeatherDetails[i] ===
                  "UV Index: " + weatherData.current.uvi
                ) {
                  var currentWeatherItem = $("<li>").text("UV Index: ");
                  currentWeatherList.append(currentWeatherItem);
                  var uvItem = $("<span>").text(weatherData.current.uvi);
                  if (uvItem.text() <= 2) {
                    uvItem.addClass("favorable");
                  } else if (uvItem.text() > 2 && uvItem.text() <= 7) {
                    uvItem.addClass("moderate");
                  } else {
                    uvItem.addClass("severe");
                  }
                  currentWeatherItem.append(uvItem);
                } else {
                  var currentWeatherItem = $("<li>").text(
                    currentWeatherDetails[i]
                  );
                  currentWeatherList.append(currentWeatherItem);
                }
              }
              $("#fiveDay").before(currentWeather);
              currentWeather.append(currentWeatherHeader);
              currentWeather.append(currentWeatherList);

              var fiveDayHeader = $("<h2>").text("5 Day Forcast:").attr({
                id: "five-day-header",
              });

              var fiveDayArray = [];
              for (var i = 0; i < 5; i++) {
                let forcastDay = moment()
                  .add(i + 1, "days")
                  .format("M/DD/YYYY");
                fiveDayArray.push(forcastDay);
              }
              for (var i = 0; i < fiveDayArray.length; i++) {
                var cardDiv = $("<div>").addClass("col3");
                var cardBody = $("<div>").addClass("card-body")
                var cardTitle = $("<h3>")
                  .addClass("card-title")
                  .text(fiveDayArray);
                var currentWeatherDetails = [
                  "Temp: " + weatherData.current.temp + " °F",
                  "Wind: " + weatherData.current.wind_speed + " MPH",
                  "Humidity: " + weatherData.current.humidity + "%",
                  "UV Index: " + weatherData.current.uvi,]
                  var temp = $("<p>")
                    .addClass("card-text")
                    .text("Temp: " + weatherData.daily[i].temp.max)
                  var wind = $("<p>")
                    .addClass("card-text")
                    .text("Wind: " + weatherData.daily[i].wind_speed + "MPH")
                  var humidity = $("<p>")
                    .addClass("card-text")
                    .text("Humidity: " + weatherData.daily[i].humidity + "%")
                  fiveDayEl.append(cardDiv);
                  cardDiv.append(cardBody);
                  cardBody.append(cardTitle);
                  cardBody.append(temp);
                  cardBody.append(wind);
                  cardBody.append(humidity);
              }
            })
          }
        })
      });
    } else {
        alert("Error, could not find city")
      } 
    })
      .catch(fucntion (error)) ;{
        alert("Unable to connect to Open Weather");
  };
}

function sumbitCitySearch(e)
  e.preventDefault();
  var city = searchedCity(cityInputEl.val().trim());
  if (searchHistoryArray.searchedCity.includes(city)) {
    alert(city + " is already in history.");
  } else if (city) {
      getWeather(city);
      searchHistory(city);
      searchHistoryArray.searchedCity.push(city);
      saveSearchHistory();
      cityInputEl.val(" ");
  } else {
      alert("Please enter valid city")
  }

  userSearch.on("submit", sumbitCitySearch);

  $("#searchBtn").on("click", function () {
    $("#currentWeather").remove();
    $("#fiveDay").empty();
    $("#fiveDayHeader").remove();
  })