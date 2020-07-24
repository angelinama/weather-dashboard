//should be put in Config file later, so far this course has not covered Config yet, so leave it as it is now
const APIKey = "2c2f279536ab63741430ebeacb9bf072";
var cityList = [];
var uvColorCodes = ['green', 'yellow', 'orange', 'red', 'purple'];

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
            forecast5(localStorage.getItem("lastCity"));
            refreshHistory();
        }
        
    });    
});

/** To refresh search history in sidebar */
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
            forecast5(event.target.textContent);
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
 
    var cardDiv = $('<div>').attr("class", "card-body"); //only purpose is for Bootstrap card styling
    $("#cityNow").html(cardDiv); //clear out the div
    
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

    var lat = response.coord.lat;
    var lon = response.coord.lon;
    // console.log(response.coord);
    //get UV Index from a different API call
    var queryURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var uvIndex = response.value;
        var p4 = $("<p>").text("UV Index: ");
        var span = $('<span>').html(uvIndex).css({"color": "white", "padding": "4px"});
        p4.append(span);
        cardDiv.append(p4);

        //set text color to white and background color based on Image file. E.g. <3 green
        if (uvIndex < 3) {
            span.css("background-color", uvColorCodes[0]);
        } else if (uvIndex < 6) {
            span.css("background-color", uvColorCodes[1]);
        } else if (uvIndex < 8) {
            span.css("background-color", uvColorCodes[2]);
        } else if (uvIndex < 11) {
            span.css("background-color", uvColorCodes[3]);
        } else {
            span.css("background-color", uvColorCodes[4]);
        }
       
    });
    
  });

}

/** Function to get 5 days for case*/
function forecast5(city, lat, lon) {
    if (typeof lat !== 'undefined' && typeof lon !== 'undefined') {
        var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    } else if (city !== ""){ //input is city name, could have better validation besides empty string but for hw now, only check
        var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
    } else {
        return -1;
    }
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        $("#forcast5").html("");
        for (var i = 0; i < response.list.length; i+= 8) {
            var date = response.list[i].dt_txt;
            date = date.split(" ")[0]; //get only the date part of timestamp, e.g.2017-01-31
            var dList = date.split("-");
            date = dList[1] + "/" + dList[2] + "/" + dList[0];
            
            var h5 = $("<h5>").text(date).attr("class", "card-title");
            var iconid = response.list[i].weather[0].icon;
            var iconImg = `https://openweathermap.org/img/wn/${iconid}@2x.png`;
            var img = $("<img>").attr("src", iconImg).attr("alt", response.list[i].weather[0].main).css({"width":"40px", "height":"40px" }); //alter is the weather text
                
            var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32; // Convert the temp to fahrenheit
            var p1 = $("<p>").text("Temp.: " + tempF.toFixed(2)).attr("class", "card-text");
            var p2 = $("<p>").text("Humidity: " + response.list[i].main.humidity).attr("class", "card-text");

            var cardEl = $("<div>").attr("class", "card card-block bg-primary text-white border p-3 .rounded-sm");
            cardEl.append(h5).append(img).append(p1).append(p2);
            $("#forcast5").append(cardEl);
            }
        });
}

//-------------Helper functions--------------------//
/** success for getting geolocation: show weather status for user's current city */
function success(position) {
    var lat  = position.coords.latitude;
    var lon = position.coords.longitude;
    
    currentWeather("", lat, lon);
    forecast5("", lat, lon);
 }

 /** error fallback is to show the last searched city. */
 function error() {
    //fallback logic: if search history exists, get the data from last city
    if (localStorage.getItem("lastCity")) {
        currentWeather(localStorage.getItem("lastCity"));
        forecast5(localStorage.getItem("lastCity"));
    } 
  }