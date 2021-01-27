# weather-dashboard
![image](https://user-images.githubusercontent.com/22566791/106036064-ab8f1880-6089-11eb-8a13-41c78527970a.png)

### User Story
As a traveler, I want to see the weather outlook for multiple cities, so that I can plan a trip accordingly.

GIVEN a weather dashboard with form inputs
- WHEN I search for a city
- THEN I am presented with current and future conditions for that city and that city is added to the search history
- WHEN I view current weather conditions for that city
- THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
- WHEN I view the UV index
- THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
- WHEN I view future weather conditions for that city
- THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
- WHEN I click on a city in the search history
- THEN I am again presented with current and future conditions for that city
- WHEN I open the weather dashboard
- THEN I am presented with the last searched city forecast

### User Manual
- If there is any searched city before, fully loaded page will show the last searched city weather report
- if not,  users can choose to share the location, and if they allow location service, fully loaded page will show weather report for current city (current temp, humidity, UV idex and 5-day forcast). 
- If no search history and no geolocation data, will show empty frame and give user an alert.

User can put in City name in Search bar to find a certain city's weather report

### Deployed link
https://angelinama.github.io/weather-dashboard/


