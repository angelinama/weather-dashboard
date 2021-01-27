//should be put in Config file later, so far this course has not covered Config yet, so leave it as it is now
const APIKey = "2c2f279536ab63741430ebeacb9bf072";
var cityList = []; //saved search city
var uvColorCodes = ['green', 'yellow', 'orange', 'red', 'purple'];

//-------------Helper functions--------------------//
/** success for getting geolocation: show weather status for user's current city */
function success(position) {
    var lat  = position.coords.latitude;
    var lon = position.coords.longitude;
    
    getSingleWeather("", lat, lon);
 }

 /** error: give user alert */
 function error() {
     alert("fail to retrive location! If you want to use your corrent location, please refresh page and click \"allow\" for pop-up question");
  }

//start of page  
$( document ).ready(function() {  
    //get all the searched cities name stored in localStorage
    if (localStorage.getItem("cityList")) {
        cityList = JSON.parse(localStorage.getItem("cityList"));
    }
    
    //dynamically generate search history
    refreshHistory();
    
    // display the last searched city 
    if (localStorage.getItem("lastCity")) {
        var lastCity = localStorage.getItem("lastCity");
        getSingleWeather(lastCity);      
    } else {// using current location if user allow location service
        navigator.geolocation.getCurrentPosition(success, error);
    }

    // handle user search in search bar
    //add ebventlistener to search input field if user use enter key instead of clicking search button
    $('#cityInput').keypress(function(event) {
        if (event.which == 13) {//enter key keycode is 13
            event.preventDefault();
            $("#searchBtn").click();
        }
        
    });
    //add eventlistener to search button
    $("#searchBtn").on('click', () => {
        var cityName = $("#cityInput").val().trim();
        if (!cityName) {
            alert("please input a city name to search!");
        } else {
            localStorage.setItem("lastCity", cityName);
            cityList.push(cityName);
            localStorage.setItem("cityList", JSON.stringify(cityList));

            getSingleWeather(cityName);

            refreshHistory();
            $("#cityInput").val(""); //clear search input
         }     
    }); 
   
});

/** To re-render search history in sidebar */
function refreshHistory() {
    $("#pastCity").html(""); //clear list 
    for (var i = 0; i < cityList.length; i++) {
        var city = cityList[i];
        var liEl = $("<li>").attr("class", "nav-item bg-white list-group-item");
        var aEl = $("<a>").attr("href","#").attr("class", "nav-link").text(city);
        liEl.append(aEl);
        $("#pastCity").append(liEl);
        
        //add Eventlistener to aEl
        aEl.on('click', (event) => {
            getSingleWeather(event.target.textContent);
        });
    }

}

/** Function to get current report for searched City 
 * input: 
 * [city]
 * Or
 * [lat, lon]
*/
function getSingleWeather(city, lat, lon) {
    //lat, lon need to be both exist to querry by geo location
    if (typeof lat !== 'undefined' && typeof lon !== 'undefined') {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    } else if (city !== ""){ //input is city name, could have better validation besides empty string but for hw now, only check
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    } else {
        alert("invalid search! Please give a city name in search bar!");
        return;
    }

    var cityName = city; //use this to pass cityName from first Ajax call response to the callback in second ajax call
    
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) { 
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        cityName = response.name;
        //get UV Index from a different API call
        queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;
        return $.ajax({
            url: queryURL,
            method: "GET"
        });  
    })
    .done(function(response) {
        //display current weather for searched city if ajax call succeeds
        displayCurrent(cityName, response); 
        displayForcast(response);
    })
    .fail(function (error) {
        console.log(error);
        alert("City not found! Please check your input. Tips: please refer to Google for correct city name. e.g. Washington D.C.");
        cityList = JSON.parse(localStorage.getItem("cityList"));
        cityList.pop();
        localStorage.setItem("cityList", JSON.stringify(cityList));
        localStorage.setItem("lastCity", cityList[cityList.length - 1]);
        refreshHistory();
    });
}

/** display current weather for given city 
 * input: 
 * [response] return value from openweather Onecall API for searched city
*/
function displayCurrent(cityName, response) {
    var date = new Date(response.current.dt * 1000);
    var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    var mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
    var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

    var cardDiv = $('<div>').attr("class", "card-body"); 
    $("#cityNow").html(cardDiv); //clear out the div
    
    var h2 = $("<h2>").text(`${cityName} (${mo}/${da}/${ye})`);
    var iconid = response.current.weather[0].icon;
    var iconImg = `https://openweathermap.org/img/wn/${iconid}@2x.png`;
    var img = $("<img>").attr("src", iconImg).attr("alt", response.current.weather[0].main); //alter is the weather text
    h2.append(img);
    
    var tempF = (response.current.temp - 273.15) * 1.80 + 32; // Convert the temp to fahrenheit
    var p1 = $("<p>").text("Temperature: " + tempF.toFixed(2) + " ℉");
    var p2 = $("<p>").text("Humidity: " + response.current.humidity + "%");
    var p3 = $("<p>").text("Wind Speed: " + response.current.wind_speed + " MPH");
    cardDiv.append(h2).append(p1).append(p2).append(p3);

    var uvIndex = response.current.uvi;
    //NOTE: OpenWeatherAPI has an issue with UV Index from oncall API, it appears that all the return value are 0, so I have to add this extra ajax call to get only UV Index
    console.log(response.current);

    var lat = response.lat;
    var lon = response.lon;
    queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    $.ajax({
        url: queryURL,
        method: "GET"})
    .done(function(result){
        uvIndex = result.value;
        var p4 = $("<p>").text("UV Index: ");
    var span = $('<span>').html(uvIndex).css({"color": "white", "padding": "4px"});
    p4.append(span);
    cardDiv.append(p4);

    //set text color to white and background color based on Image file. Color codes refer to: https://en.wikipedia.org/wiki/Ultraviolet_index
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
    })
    .fail(function(error) {
        console.log(error)
    });
}

/** Function to get 5 days forcast using response from Onecall API response*/
function displayForcast(response) {
    $("#forcastHeader").text("5-Day Forcast");
    $("#forcast5").html("");
    for (var i = 1; i <= 5; i++) {
        var date = new Date(response.daily[i].dt * 1000);
        var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        var mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
        var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        date = mo + '/'+ da + '/' + ye;

        var h5 = $("<h5>").text(date).attr("class", "card-title");
        var iconid = response.daily[i].weather[0].icon;
        var iconImg = `https://openweathermap.org/img/wn/${iconid}@2x.png`;
        var img = $("<img>").attr("src", iconImg).attr("alt", response.daily[i].weather[0].main).css({"width":"40px", "height":"40px" }); //alter is the weather text
                    
        var tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32; // Convert the temp to fahrenheit
        var p1 = $("<p>").text("Temp.: " + tempF.toFixed(2) + " ℉").attr("class", "card-text");
        var p2 = $("<p>").text("Humidity: " + response.daily[i].humidity + "%").attr("class", "card-text");

        var cardEl = $("<div>").attr("class", "card card-block bg-primary text-white border p-3 .rounded-sm");
        cardEl.append(h5).append(img).append(p1).append(p2);
        $("#forcast5").append(cardEl);
    }
}