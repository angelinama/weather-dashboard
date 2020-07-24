//should be put in Config file later, so far this course has not covered Config yet, so leave it as it is now
const APIKey = "2c2f279536ab63741430ebeacb9bf072";
var cityList = [];

$( document ).ready(function() {
    navigator.geolocation.getCurrentPosition(success, error);
    
    if (localStorage.getItem("cityList")) {
        cityList = JSON.parse(localStorage.getItem("cityList"));
    }
    
    //dynamically generate search history
    refreshHistory();
    
    //add eventlistener to search bar
    $("#searchBtn").on('click', () => {
        var cityName = $("#cityInput").val();
        if (!cityName) {
            alert("please input a city name to search!");
        } else {
            localStorage.setItem("lastCity", cityName);
            cityList.push(cityName);
            localStorage.setItem("cityList", JSON.stringify(cityList));
            currentWeather(localStorage.getItem("lastCity"));
            refreshHistory();
        }
        
    });    
});

/** */
function refreshHistory() {
    $("#pastCity").html(""); //clear list 
    for (var i = 0; i < cityList.length; i++) {
        var city = cityList[i];
        var liEl = $("<li>").attr("class", "nav-item");
        var aEl = $("<a>").attr("href","#").attr("class", "nav-link").text(city);
        liEl.append(aEl);
        $("#pastCity").append(liEl);
        
        //add Eventlistener to aEl
        aEl.on('click', (event) => {
            currentWeather(event.target.textContent);
        });
    }

}
/** Function to get current report for searched City 
 * input: 
 * [city]
 * Or
 * [lat, lon]
*/
function currentWeather(city, lat, lon) {
    //lat, lon need to be both exist to querry by geo location
    if (typeof lat !== 'undefined' && typeof lon !== 'undefined') {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    } else if (city !== ""){ //input is city name, could have better validation besides empty string but for hw now, only check
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    } else {
        return -1;
    }
    
  $.ajax({
  url: queryURL,
  method: "GET"
})
.then(function(response) {
    //NoTE: A easier way to get current date would be from 5-day forcast but II want to use Date() for practice
    var date = new Date(response.dt * 1000);
    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    var mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    
    var cityDiv = $("#cityNow").html(""); //clear out the div
    var cardDiv = $('<div>').attr("class", "card-body"); //only purpose is for Bootstrap card styling
    var h2 = $("<h2>").text(`${response.name} (${mo}/${da}/${ye})`);
    var iconid = response.weather[0].icon;
    var iconImg = `https://openweathermap.org/img/wn/${iconid}@2x.png`;
    var img = $("<img>").attr("src", iconImg).attr("alt", response.weather[0].main); //alter is the weather text
    h2.append(img);
    
    var tempF = (response.main.temp - 273.15) * 1.80 + 32; // Convert the temp to fahrenheit
    var p1 = $("<p>").text("Temperature: " + tempF.toFixed(2));
    var p2 = $("<p>").text("Humidity: " + response.main.humidity);
    var p3 = $("<p>").text("Wind Speed: " + response.wind.speed);

    cardDiv.append(h2).append(p1).append(p2).append(p3);
    cityDiv.append(cardDiv);
  });

}


//Helper functions
/** success for getting geolocation: show weather status for user's current city */
function success(position) {
    var lat  = position.coords.latitude;
    var lon = position.coords.longitude;
    
    currentWeather("", lat, lon);
 }

 /** error fallback is to show the last searched city. If no search history, show default city */
 function error() {
    //fallback logic: if search history exists, get the data from last city; if not, get the default city Seattle
    if (localStorage.getItem("lastCity")) {
        currentWeather(localStorage.getItem("lastCity"));
    } else {
        currentWeather("Seattle"); //without any location input, Seattle is the default city
    }
  }