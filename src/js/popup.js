// Sends a message to the background script to get the current weather data and updates the UI when data is received
let currentBadgeState = '';
browser.runtime.sendMessage({ action: 'getWeatherData' }).then((weatherData) => {
    if (weatherData) {
        updateWeatherUI(weatherData);
    }
}).catch((error) => {
    console.error("Error getting weather data: ", error);
});

// Updates the browser badge with the current temperature, converting units if necessary
function updateBadgeTemperature(temperature) {
    let unit = localStorage.getItem('temperatureRadio') || 'C';
    let degreeSymbol = 'º';

    if (unit === 'F') {
        temperature = (temperature * 9 / 5) + 32;
    }

    const newBadgeText = `${Math.round(temperature)}${degreeSymbol}`;

    if (currentBadgeState !== newBadgeText) {
        browser.browserAction.setBadgeText({ text: newBadgeText });
        currentBadgeState = newBadgeText;
    }
}

// Updates the weather information on the user interface and applies necessary formatting
function updateWeatherUI(weatherData) {
    const temperatureElement = document.getElementById("temperature");
    if (temperatureElement) {
        temperatureElement.textContent = `${convertTemp(weatherData.temperature || 0)}`;
        updateBadgeTemperature(weatherData.temperature || 0);
    }

    // Update other UI elements with weather data
    const cityElement = document.getElementById("city");
    const descriptionElement = document.getElementById("description");
    const tempMinElement = document.getElementById("temperatureMin");
    const tempMaxElement = document.getElementById("temperatureMax");
    const humidityElement = document.getElementById("humidity");
    const windElement = document.getElementById("wind");
    const gustElement = document.getElementById("gust");
    const imageWeather = document.getElementById("imageWeather");
    const dayTomorrow = document.getElementById("tomorrow");
    const dayAfterTomorrow = document.getElementById("afterTomorrow");

    // Set text content for tomorrow and after tomorrow weather details
    dayTomorrow.textContent = browser.i18n.getMessage("tomorrow");
    dayAfterTomorrow.textContent = browser.i18n.getMessage("next48Hours");

    // Update remaining UI elements with weather data
    if (cityElement) cityElement.textContent = weatherData.city || 'N/A';
    if (descriptionElement) descriptionElement.textContent = weatherData.description || 'N/A';
    if (temperatureElement) temperatureElement.textContent = `${convertTemp(weatherData.temperature || 0)}`;
    if (tempMinElement) tempMinElement.textContent = `${convertTemp(weatherData.tempMin || 0)}`;
    if (tempMaxElement) tempMaxElement.textContent = `${convertTemp(weatherData.tempMax || 0)}`;
    if (humidityElement) humidityElement.textContent = `${weatherData.humidity || 'N/A'} %`;
    if (windElement) windElement.textContent = `${convertSpeed(weatherData.wind || 0)}`;
    if (gustElement) gustElement.textContent = `${convertSpeed(weatherData.gust || 0)}`;

    if (imageWeather) imageWeather.src = weatherData.imageWeather || '';

    // Update tomorrow's weather UI elements
    const tempMinTomorrowElement = document.getElementById("tempMinTomorrow");
    const tempMaxTomorrowElement = document.getElementById("tempMaxTomorrow");
    const weatherTomorrowElement = document.getElementById("weatherTomorrow");
    const imageWeatherTomorrowElement = document.getElementById("imageWeatherTomorrow");

    if (tempMinTomorrowElement) tempMinTomorrowElement.textContent = `${convertTemp(weatherData.tempMinTomorrow || 0)}`;
    if (tempMaxTomorrowElement) tempMaxTomorrowElement.textContent = `${convertTemp(weatherData.tempMaxTomorrow || 0)}`;
    if (weatherTomorrowElement) weatherTomorrowElement.textContent = weatherData.weatherTomorrow || 'N/A';
    if (imageWeatherTomorrowElement) imageWeatherTomorrowElement.src = weatherData.imageWeatherTomorrow || '';

    // Update after tomorrow's weather UI elements
    const tempMinAfterTomorrowElement = document.getElementById("tempMinAfterTomorrow");
    const tempMaxAfterTomorrowElement = document.getElementById("tempMaxAfterTomorrow");
    const weatherAfterTomorrowElement = document.getElementById("weatherAfterTomorrow");
    const imageWeatherAfterTomorrowElement = document.getElementById("imageWeatherAfterTomorrow");

    if (tempMinAfterTomorrowElement) tempMinAfterTomorrowElement.textContent = `${convertTemp(weatherData.tempMinAfterTomorrow || 0)}`;
    if (tempMaxAfterTomorrowElement) tempMaxAfterTomorrowElement.textContent = `${convertTemp(weatherData.tempMaxAfterTomorrow || 0)}`;
    if (weatherAfterTomorrowElement) weatherAfterTomorrowElement.textContent = weatherData.weatherAfterTomorrow || 'N/A';
    if (imageWeatherAfterTomorrowElement) imageWeatherAfterTomorrowElement.src = weatherData.imageWeatherAfterTomorrow || '';

    // Store the badge weather icon and apply grayscale filter based on the icon type
    localStorage.setItem("badgeWeatherIcon", weatherData.imageWeather);
    if (!weatherData.imageWeather.includes('n.png')) {
        document.getElementById("imageWeather").style.filter = "grayscale(0%)";
        document.getElementById("imageWeatherTomorrow").style.filter = "grayscale(0%)";
        document.getElementById("imageWeatherAfterTomorrow").style.filter = "grayscale(0%)";

        document.getElementById("separator1").style.background = "#E1EBF2";
        document.getElementById("separator2").style.background = "#E1EBF2";
        document.getElementById("separator3").style.background = "#E1EBF2";
        document.getElementById("separator4").style.background = "#E1EBF2";
        document.getElementById("separator5").style.background = "#E1EBF2";
        document.getElementById("separator6").style.background = "#E1EBF2";
    } else {
        document.getElementById("imageWeather").style.filter = "grayscale(0%)";
        document.getElementById("imageWeatherTomorrow").style.filter = "grayscale(0%)";
        document.getElementById("imageWeatherAfterTomorrow").style.filter = "grayscale(0%)";

        document.getElementById("separator1").style.background = "#DCD5F2";
        document.getElementById("separator2").style.background = "#DCD5F2";
        document.getElementById("separator3").style.background = "#DCD5F2";
        document.getElementById("separator4").style.background = "#DCD5F2";
        document.getElementById("separator5").style.background = "#DCD5F2";
        document.getElementById("separator6").style.background = "#DCD5F2";
    }

    document.getElementById("loading").style.display = "none";
    setTimeout(function () {
        document.getElementById("forecastPanel").style.display = "inline";
    }, 500);
}

// Applies user preferences for temperature unit and weather icon display
function applyPreferences() {
    let temperatureUnit = localStorage.getItem('temperatureRadio') || 'C';
    const tempUnitElement = document.getElementById("tempUnit");

    if (tempUnitElement) {
        tempUnitElement.textContent = (temperatureUnit === 'F') ? '°F' : '°C';
    }

    let showWeatherIcon = localStorage.getItem('showWeatherIcon') || 'True';
    const imageWeatherTomorrowElement = document.getElementById("imageWeatherTomorrow");
    const imageWeatherAfterTomorrowElement = document.getElementById("imageWeatherAfterTomorrow");

    if (showWeatherIcon === 'False') {
        if (imageWeatherTomorrowElement) imageWeatherTomorrowElement.style.display = 'none';
        if (imageWeatherAfterTomorrowElement) imageWeatherAfterTomorrowElement.style.display = 'none';
    } else {
        if (imageWeatherTomorrowElement) imageWeatherTomorrowElement.style.display = 'block';
        if (imageWeatherAfterTomorrowElement) imageWeatherAfterTomorrowElement.style.display = 'block';
    }
}

// Converts temperature to the selected unit (Celsius or Fahrenheit)
function convertTemp(temp) {
    if (isNaN(temp) || temp === null || temp === undefined) {
        return 'N/A';
    }

    let unit = localStorage.getItem('temperatureRadio') || 'C';
    if (unit === 'F') {
        return `${((temp * 9 / 5) + 32).toFixed(1)}°F`;
    } else {
        return `${parseFloat(temp).toFixed(1)}°C`;
    }
}

// Converts speed to the selected unit (km/h or mph)
function convertSpeed(speed) {
    if (isNaN(speed) || speed === null || speed === undefined) {
        return 'N/A';
    }

    let unit = localStorage.getItem('speedRadio') || 'km';
    if (unit === 'mph') {
        return `${(speed / 1.609).toFixed(1)} mph`;
    } else {
        return `${parseFloat(speed).toFixed(1)} km/h`;
    }
}

