# weather-dashboard
<img width="1438" alt="1" src="https://user-images.githubusercontent.com/22566791/88439525-4ef02f80-cdc0-11ea-81a2-5283c74ff240.png">

### User Story
As a traveler, I want to see the weather outlook for multiple cities, so that I can plan a trip accordingly.

### User Manual
During the page load, user can choose if they allow sharing current location:
- if they choose to share the location, fully loaded page will show weather report for current city (current temp, humidity, UV idex and 5-day forcast). 
- If not, fully loaded page will show the last searched city weather report
- If no search history and no geolocation data, will show empty frame.

User can put in City name in Search bar to find a certain city's weather report

### Deployed link
https://angelinama.github.io/weather-dashboard/


### TODO
Clean up the logic to wait all ajax call done and then process the response