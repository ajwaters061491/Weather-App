let appID = '1c34ba4143b918694e7cdc542798b25f'; //API key, can be found @ https://home.openweathermap.org/api_keys
let units = 'imperial'; //units to be used
let searchMethod; //search method will have either zip code or city name

function getSearchMethdod(searchTerm) {
    if(searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm) { //checks length for length of 5, and checks to see if the number value is equal to string value 
        searchMethod = 'zip'; 
    } else {
        searchMethod = 'q' //q is the search method for city name
    }
}

function searchWeather(searchTerm) {
    getSearchMethdod(searchTerm);

    fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appID}&units=${units}`).then(result => {
        return result.json(); //makes call with the format 'api.openweathermap.org/data/2.5/weather?q=London' and converts to a json object
    }).then(result => { //parses results and passes to init function
        init(result)
    })
}

function init(resultFromServer) {
    switch (resultFromServer.weather[0].main) { //changes background image based on the weather types
        case 'Clear':
        document.body.style.backgroundImage = 'url("./images/clear.jpg")';
        break;

        case 'Clouds':
        document.body.style.backgroundImage = 'url("./images/cloudy.jpg")'; 
        break;

        case 'Rain':
        case 'Drizzle':
        case 'Mist':
        document.body.style.backgroundImage = 'url("./images/rain.jpg")'; 
        break;

        case 'Thunderstorm':
        document.body.style.backgroundImage = 'url("./images/storm.jpg")'; 
        break;

        case 'Snow':
        document.body.style.backgroundImage = 'url("./images/snow.jpg")'; 
        break;

        default:
            break;
    }

    let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
    let temperatureElement = document.getElementById('temperature');
    let humidityElement = document.getElementById('humidity');
    let windSpeedElement = document.getElementById('windSpeed');
    let cityHeader = document.getElementById('cityHeader');
    let weatherIcon = document.getElementById('documentImg');
    const windSpeedConv = 2.23694; //wind speed conversion value

    weatherIcon.src = 'http://openweathermap.org/img/w/' + resultFromServer.weather[0].icon + '.png'; //pulls icon from json object, https://openweathermap.org/weather-conditions

    let resultDescription = resultFromServer.weather[0].description; //Description of weather
    weatherDescriptionHeader.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1); //sets the text description to have a capital first letter

    temperatureElement.innerHTML = Math.floor(resultFromServer.main.temp) + '&#176'; //temperature with degrees symbol
    windSpeedElement.innerHTML = 'Winds at ' + (Math.floor(resultFromServer.wind.speed) * windSpeedConv).toFixed(0) + ' MPH'; //object returns meters per second by default, this does conversion
    cityHeader.innerHTML = resultFromServer.name;
    humidityElement.innerHTML = 'Humidity levels at ' + resultFromServer.main.humidity + '%'; //This does rounding automatically

    setPositionForWeatherInfo();
}

function setPositionForWeatherInfo() {
    let weatherContainer = document.getElementById('weatherContainer'); //this bit sets the height and width to be set and used for centering
    let weatherContainerHeight = weatherContainer.clientHeight;
    let weatherContainerWidth = weatherContainer.clientWidth;

    weatherContainer.style.left = `calc(50% - ${weatherContainerWidth/2}px)`; //centers the position of the box horizontally
    weatherContainer.style.top = `calc(50% - ${weatherContainerHeight/1.3}px)`; //offsets the centering of the box vertically (slightly above)
    weatherContainer.style.visibility = 'visible';
}

document.getElementById('searchBtn').addEventListener('click', () => { //search button setup
    let searchTerm = document.getElementById('searchInput').value;

    if(searchTerm) {
        searchWeather(searchTerm);
    }
})