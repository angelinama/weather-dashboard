//should be put in Config file later, so far this course has not covered Config yet, so leave it as it is now
const APIKey = "2c2f279536ab63741430ebeacb9bf072";
var cityList = [];

$( document ).ready(function() {
    navigator.geolocation.getCurrentPosition(success, error);

    $("#searchBtn").on('click', () => {
        var cityName = $("#cityInput").val();
        if (!cityName) {
            alert("please input a city name to search!");
        } else {
            localStorage.setItem("lastCity", cityName);
            if (localStorage.getItem("cityList")) {
                cityList = JSON.parse(localStorage.getItem("cityList"));
            } 
            cityList.push(cityName);
            
            localStorage.setItem("cityList", JSON.stringify(cityList));
            currentWeather(localStorage.getItem("lastCity"));
        }
        
    });
    

    
});

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
    console.log(response);
    //NoTE: A easier way to get current date would be from 5-day forcast but II want to use Date() for practice
    var date = new Date(response.dt * 1000);
    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    
    var cityDiv = $("#cityNow").html("<h2>" + response.name + " (" + `${da}-${mo}-${ye}` + ") " + "</h2>");
    var iconid = response.weather[0].icon;
    var iconImg = `https://openweathermap.org/img/wn/${iconid}@2x.png`;
    var img = $("<img>").attr("src", iconImg).attr("alt", response.weather[0].main); //alter is the weather text
    var tempF = (response.main.temp - 273.15) * 1.80 + 32; // Convert the temp to fahrenheit
    var p1 = $("<p>").text("Temperature: " + tempF.toFixed(2));
    var p2 = $("<p>").text("Humidity: " + response.main.humidity);
    var p3 = $("<p>").text("Wind Speed: " + response.wind.speed);
    
    
    

    cityDiv.append(img).append(p1).append(p2).append(p3);
  });

}

 function success(position) {
    var lat  = position.coords.latitude;
    var lon = position.coords.longitude;
    
    currentWeather("", lat, lon);
 }

 function error() {
    alert('Unable to retrieve your location!');
    //fallback logic: if search history exists, get the data from last city; if not, get the default city Seattle
    if (localStorage.getItem("lastCity")) {
        currentWeather(localStorage.getItem("lastCity"));
    } else {
        currentWeather("Seattle"); //without any location input, Seattle is the default city
    }
  }