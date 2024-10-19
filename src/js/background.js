
// Define OpenWeatherMap API key and initialize local storage object
const openMapWeatherMapApiKey = '';
let myStorage = window.localStorage || {};

// Fetch weather data when the extension is installed
browser.runtime.onInstalled.addListener(() => {
    getLatitudeLongitudeAndFetchWeather();
});

// Fetch weather data when the browser starts up
browser.runtime.onStartup.addListener(() => {
    getLatitudeLongitudeAndFetchWeather();
});

// Handle incoming messages, such as requests for weather data
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getWeatherData') {
        const savedWeather = loadSavedWeatherData();
        sendResponse(savedWeather);
    }
    return true;
});

// Initialize localStorage defaults when the extension is installed
browser.runtime.onInstalled.addListener(() => {
    initializeLocalStorageDefaults();
    getLatitudeLongitudeAndFetchWeather();
});

// Fetch weather data when the browser starts
browser.runtime.onStartup.addListener(() => {
    getLatitudeLongitudeAndFetchWeather();
});

// Handle temperature unit update messages and refresh the weather badge
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateTemperatureUnit') {
        browser.runtime.sendMessage({ action: 'getWeatherData' }).then((weatherData) => {
            if (weatherData) {
                updateBadgeTemperature(weatherData.temperature || 0, message.unit);
            }
        }).catch((error) => {
            console.error("Error getting weather data: ", error);
        });
    }
});

// Update the badge temperature and convert to Fahrenheit if necessary
function updateBadgeTemperature(temperature, unit = null) {
    let degreeSymbol = 'º';
    unit = unit || localStorage.getItem('temperatureRadio') || 'C';

    if (unit === 'F') {
        temperature = (temperature * 9 / 5) + 32;
    }

    const newBadgeText = `${Math.round(temperature)}${degreeSymbol}`;

    browser.browserAction.setBadgeText({ text: newBadgeText });
}

// Retrieve latitude and longitude from local storage or fetch them using geolocation
function getLatitudeLongitudeAndFetchWeather(providedLatitude, providedLongitude) {
    if (providedLatitude && providedLongitude) {
        fetchWeatherData(providedLatitude, providedLongitude);
    } else {
        const savedLocation = myStorage.getItem("savedLocation");
        if (savedLocation) {
            const locationData = JSON.parse(savedLocation);
            if (locationData.lat && locationData.lng) {
                fetchWeatherData(locationData.lat, locationData.lng);
            } else {
                getGeolocation();
            }
        } else {
            getGeolocation();
        }
    }
}

// Fetch the user's geolocation and store it for future use
function getGeolocation() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            myStorage.setItem("savedLocation", JSON.stringify({ lat: latitude, lng: longitude }));
            fetchWeatherData(latitude, longitude);
        },
        function () {
            console.error("Error getting geolocation!");
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Fetch weather data from the OpenWeatherMap API using the provided coordinates
function fetchWeatherData(latitude, longitude) {
    if (!latitude || !longitude) {
        return;
    }

    let browserLanguage = browser.i18n.getUILanguage().split("-")[0];
    let requestAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&type=accurate&appid=${openMapWeatherMapApiKey}&lang=${browserLanguage}`;

    fetch(requestAPI)
        .then(response => response.json())
        .then(toolbarWeather => {
            if (toolbarWeather.list && Array.isArray(toolbarWeather.list)) {
                let weatherNow = toolbarWeather.list[0];
                let weatherTomorrow = toolbarWeather.list[8];
                let weatherAfterTomorrow = toolbarWeather.list[16];
                saveWeatherData(toolbarWeather, weatherNow, weatherTomorrow, weatherAfterTomorrow);
            } else {
            }
        })
        .catch(error => console.error("Error fetching  weather data: ", error));
}
window.fetchWeatherData = fetchWeatherData;

// Save the fetched weather data in localStorage for future use
function saveWeatherData(toolbarWeather, weatherNow, weatherTomorrow, weatherAfterTomorrow) {
    myStorage.setItem("city", toolbarWeather.city.name);
    myStorage.setItem("temperature", weatherNow.main.temp);
    myStorage.setItem("temperatureMin", weatherNow.main.temp_min);
    myStorage.setItem("temperatureMax", weatherNow.main.temp_max);
    myStorage.setItem("humidity", weatherNow.main.humidity);
    myStorage.setItem("wind", weatherNow.wind.speed);
    myStorage.setItem("gust", weatherNow.wind.gust);
    myStorage.setItem("description", weatherNow.weather[0].description);

    myStorage.setItem("tempMinTomorrow", weatherTomorrow.main.temp_min);
    myStorage.setItem("tempMaxTomorrow", weatherTomorrow.main.temp_max);
    myStorage.setItem("tempMinAfterTomorrow", weatherAfterTomorrow.main.temp_min);
    myStorage.setItem("tempMaxAfterTomorrow", weatherAfterTomorrow.main.temp_max);

    myStorage.setItem("weatherTomorrow", weatherTomorrow.weather[0].description);
    myStorage.setItem("weatherAfterTomorrow", weatherAfterTomorrow.weather[0].description);

    myStorage.setItem("imageWeather", `../res/icons/weather_popup/${weatherNow.weather[0].icon}.png`);
    myStorage.setItem("imageWeatherTomorrow", `../res/icons/weather_popup/${weatherTomorrow.weather[0].icon}.png`);
    myStorage.setItem("imageWeatherAfterTomorrow", `../res/icons/weather_popup/${weatherAfterTomorrow.weather[0].icon}.png`);

    if (!weatherNow.weather[0].icon.includes('n.png')) {
        if (myStorage.getItem("pickerBackgroundNotificationDay") == null) {
            browser.browserAction.setBadgeBackgroundColor({
                color: "#5387E8"
            });
        } else {
            var val = myStorage.getItem("pickerBackgroundNotificationDay");
            browser.browserAction.setBadgeBackgroundColor({
                color: val
            });
        }
        if (myStorage.getItem("pickerFontNotificationDay") == null) {
            browser.browserAction.setBadgeTextColor({
                color: "#FFFFFF"
            });
        } else {
            var val = myStorage.getItem("pickerFontNotificationDay");
            browser.browserAction.setBadgeTextColor({
                color: val
            });
        }
    } else {
        if (myStorage.getItem("pickerBackgroundNotificationNight") == null) {
            browser.browserAction.setBadgeBackgroundColor({
                color: "#722C80"
            });
        } else {
            var val = myStorage.getItem("pickerBackgroundNotificationNight");
            browser.browserAction.setBadgeBackgroundColor({
                color: val
            });
        }
        if (myStorage.getItem("pickerFontNotificationNight") == null) {
            browser.browserAction.setBadgeTextColor({
                color: "#FFFFFF"
            });
        } else {
            var val = myStorage.getItem("pickerFontNotificationNight");
            browser.browserAction.setBadgeTextColor({
                color: val
            });
        }
    }

    let weatherIcon = `../res/icons/weather_popup/${weatherNow.weather[0].icon}.png`;
    browser.browserAction.setIcon({
        path: weatherIcon
    });
    updateBadge(weatherNow.main.temp);
    showNotificationWeather();
    showWeatherIcon(weatherIcon);
    setBadgeColors();
}

// Update the badge with the current temperature    
function updateBadge(temperature) {
    browser.storage.local.get(['temperatureRadio', 'speedRadio'], function() {
        let temperatureUnit = localStorage.getItem('temperatureRadio');
        let degreeSymbol = 'º';
            
        let temperatureValue = parseFloat(temperature);
        if (!isNaN(temperatureValue)) {
            if (temperatureUnit === 'F') {
                temperatureValue = (temperatureValue * 9 / 5) + 32; 
            }
            browser.browserAction.setBadgeText({ text: `${Math.round(temperatureValue)}${degreeSymbol}` });
        } else {
            browser.browserAction.setBadgeText({ text: '' });
        }
    });
}

// Show weather notifications if the user has enabled them  
function showNotificationWeather() {
    if (localStorage.getItem("showTemperature") == null || 
        localStorage.getItem("showTemperature") === "undefined" || 
        localStorage.getItem("showTemperature") === "False") {
        updateNotification = "";
    } else {
        updateNotification = localStorage.getItem("temperature");
    }

    let unit = "º";
    let temperatureValue = parseFloat(updateNotification);

    const temperatureUnit = localStorage.getItem("temperatureRadio");
    if (temperatureUnit === "F") {
        unit = "º";
        temperatureValue = (temperatureValue * 9/5) + 32;
    }

    if (!isNaN(temperatureValue)) { 
        let roundedTemp = Math.round(temperatureValue); 
        browser.browserAction.setBadgeText({
            text: `${roundedTemp}${unit}`
        });
    } else {
        browser.browserAction.setBadgeText({
            text: ""
        });
    }
}   

// Show or hide the weather icon based on user preferences
function showWeatherIcon(value) {
    const showIconSetting = localStorage.getItem("showWeatherIcon");

    if (showIconSetting === null || showIconSetting === "True") {
        browser.browserAction.setIcon({
            path: value
        });
    } else if (showIconSetting === "False") {
        browser.browserAction.setIcon({
            path: "../res/icons/icon.png"
        });
    } else {
        browser.browserAction.setIcon({
            path: "../res/icons/icon.png"
        });
    }
}

// Set badge colors based on the time of day and weather icon
function setBadgeColors() {
    const isDayTime = !localStorage.getItem("imageWeather").includes('n.png');

    if (isDayTime) {
        const dayBackgroundColor = localStorage.getItem("pickerBackgroundNotificationDay") || "#5387E8";
        const dayFontColor = localStorage.getItem("pickerFontNotificationDay") || "#FFFFFF";
        
        browser.browserAction.setBadgeBackgroundColor({ color: dayBackgroundColor });
        browser.browserAction.setBadgeTextColor({ color: dayFontColor });
    } else {
        const nightBackgroundColor = localStorage.getItem("pickerBackgroundNotificationNight") || "#722C80";
        const nightFontColor = localStorage.getItem("pickerFontNotificationNight") || "#FFFFFF";

        browser.browserAction.setBadgeBackgroundColor({ color: nightBackgroundColor });
        browser.browserAction.setBadgeTextColor({ color: nightFontColor });
    }
} 

// Waits for the DOM to be fully loaded before executing initialization and weather data fetching functions.
document.addEventListener("DOMContentLoaded", function () {
    initializeLocalStorageDefaults();
    getLatitudeLongitudeAndFetchWeather();
});

// Function to load previously saved weather data from localStorage.
// Returns an object with all relevant weather data that was previously stored.
function loadSavedWeatherData() {
    const savedWeather = {
        city: localStorage.getItem("city"),
        description: localStorage.getItem("description"),
        temperature: localStorage.getItem("temperature"),
        tempMin: localStorage.getItem("temperatureMin"),
        tempMax: localStorage.getItem("temperatureMax"),
        humidity: localStorage.getItem("humidity"),
        wind: localStorage.getItem("wind"),
        gust: localStorage.getItem("gust"),
        imageWeather: localStorage.getItem("imageWeather"),
        tempMinTomorrow: localStorage.getItem("tempMinTomorrow"),
        tempMaxTomorrow: localStorage.getItem("tempMaxTomorrow"),
        weatherTomorrow: localStorage.getItem("weatherTomorrow"),
        imageWeatherTomorrow: localStorage.getItem("imageWeatherTomorrow"),
        tempMinAfterTomorrow: localStorage.getItem("tempMinAfterTomorrow"),
        tempMaxAfterTomorrow: localStorage.getItem("tempMaxAfterTomorrow"),
        weatherAfterTomorrow: localStorage.getItem("weatherAfterTomorrow"),
        imageWeatherAfterTomorrow: localStorage.getItem("imageWeatherAfterTomorrow"),
    };

    return savedWeather;
}

// Initialize localStorage with default values
function initializeLocalStorageDefaults() {
    if (localStorage.getItem("speedRadio") === null) localStorage.setItem("speedRadio", "km");
    if (localStorage.getItem("temperatureRadio") === null) localStorage.setItem("temperatureRadio", "C");
    if (localStorage.getItem("contextMenu") === null) localStorage.setItem("contextMenu", "False");
    if (localStorage.getItem("timer") === null) localStorage.setItem("timer", 15);
    if (localStorage.getItem("pickerBackgroundNotificationDay") === null) localStorage.setItem("pickerBackgroundNotificationDay", "#5387E8");
    if (localStorage.getItem("pickerBackgroundNotificationNight") === null) localStorage.setItem("pickerBackgroundNotificationNight", "#722C80");
    if (localStorage.getItem("pickerFontNotificationDay") === null) localStorage.setItem("pickerFontNotificationDay", "#FFFFFF");
    if (localStorage.getItem("pickerFontNotificationNight") === null) localStorage.setItem("pickerFontNotificationNight", "#FFFFFF");
    if (localStorage.getItem("showTemperature") === null) localStorage.setItem("showTemperature", "True");
    if (localStorage.getItem("showWeatherIcon") === null) localStorage.setItem("showWeatherIcon", "True");
}

// Reload weather data at regular intervals based on the user's preferences
function timeRefresh() {
    reloadMinutes = localStorage.getItem("timer") || 15;
    reloadMinutes = parseInt(reloadMinutes, 10);

    setInterval(() => {
        const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
        if (savedLocation && savedLocation.lat && savedLocation.lng) {
            saveLatitude = savedLocation.lat;
            saveLongitude = savedLocation.lng;

            fetchWeatherData(saveLatitude, saveLongitude);
        }
    }, reloadMinutes * 60 * 1000);
}

// Create the context menu based on the user's preferences
function contextMenuFunction() {
    if (localStorage.getItem("contextMenu") === "True") {
        browser.menus.create({
            id: "toolbar-weather",
            title: "Toolbar Weather",
            contexts: ["selection"],
        });

        browser.menus.create({
            id: "degree",
            title: browser.i18n.getMessage("degree"),
            contexts: ["all"],
        });

        if (localStorage.getItem("temperatureRadio") === "F") {
            browser.menus.create({
                id: "C",
                type: "radio",
                title: "°C",
                contexts: ["all"],
                checked: false,
            }); 

            browser.menus.create({
                id: "F",
                type: "radio",
                title: "°F",
                contexts: ["all"],
                checked: true,
            });
        } else {
            browser.menus.create({
                id: "C",
                type: "radio",
                title: "°C",
                contexts: ["all"],
                checked: true,
            });

            browser.menus.create({
                id: "F",
                type: "radio",
                title: "°F",
                contexts: ["all"],
                checked: false,
            });
        }

        browser.menus.create({
            id: "separator-1",
            type: "separator",
            contexts: ["all"],
        });

        browser.menus.create({
            id: "speed",
            title: browser.i18n.getMessage("speed"),
            contexts: ["all"],
        });

        if (localStorage.getItem("speedRadio") === "mph") {
            browser.menus.create({
                id: "mph",
                type: "radio",
                title: "mph",
                contexts: ["all"],
                checked: true,
            });

            browser.menus.create({
                id: "kmh",
                type: "radio",
                title: "km/h",
                contexts: ["all"],
                checked: false,
            });
        } else {
            browser.menus.create({
                id: "mph",
                type: "radio",
                title: "mph",
                contexts: ["all"],
                checked: false,
            });

            browser.menus.create({
                id: "kmh",
                type: "radio",
                title: "km/h",
                contexts: ["all"],
                checked: true,
            });
        }
    } else {
        browser.menus.removeAll();
    }   
}

// Start the interval-based refresh and initialize the context menu
timeRefresh();
contextMenuFunction();