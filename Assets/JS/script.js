//should be put in Config file later, so far this course has not covered Config yet, so leave it as it is now
const APIKey = "2c2f279536ab63741430ebeacb9bf072";
 


$( document ).ready(function() {
    $("#searchBtn").on('click', (event) => {
        var cityName = $("#cityInput").val();
        localStorage.setItem("lastCity", cityName);
        currentWeather(cityName);
    });
    

    
});

/** Function to get current report for searched City */
function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +city + "&appid=" + APIKey;
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
   
    // $(".wind").text("Wind Speed: " + response.wind.speed);
    // $(".humidity").text("Humidity: " + response.main.humidity);
    
    // // Convert the temp to fahrenheit
    // var tempF = (response.main.temp - 273.15) * 1.80 + 32;

  
  });

}

