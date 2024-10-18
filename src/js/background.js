let api = "";
let myStorage = window.localStorage || {};

browser.runtime.onInstalled.addListener(() => {
    getLatitudeLongitudeAndFetchWeather();
});

browser.runtime.onStartup.addListener(() => {
    getLatitudeLongitudeAndFetchWeather();
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getWeatherData') {
        const savedWeather = loadSavedWeatherData();
        sendResponse(savedWeather);
    }
    return true;
});

browser.runtime.onInstalled.addListener(() => {
    initializeLocalStorageDefaults();
    getLatitudeLongitudeAndFetchWeather();
});

browser.runtime.onStartup.addListener(() => {
    getLatitudeLongitudeAndFetchWeather();
});

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

function fetchWeatherData(latitude, longitude) {
    if (!latitude || !longitude) {
        return;
    }

    let browserLanguage = browser.i18n.getUILanguage().split("-")[0];
    let requestAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&type=accurate&appid=${api}&lang=${browserLanguage}`;

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

function updateBadge(temperature) {
    browser.storage.local.get(['temperatureRadio', 'speedRadio'], function(result) {
        let temperatureUnit = result.temperatureRadio || 'C';
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

function showNotificationWeather() {
    if (localStorage.getItem("showTemperature") == null) {
        updateNotification = localStorage.getItem("temperature");
    } else if (localStorage.getItem("showTemperature") == "True") {
        updateNotification = localStorage.getItem("temperature");
    } else if (localStorage.getItem("showTemperature") == "undefined") {
        updateNotification = localStorage.getItem("temperature");
    } else {
        updateNotification = "";
    }

    let unit = "º";         
    let temperatureValue = parseFloat(updateNotification);
    
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

function showWeatherIcon(value) {
    const showIconSetting = localStorage.getItem("showWeatherIcon");

    // Check if localStorage value is null or not properly set
    if (showIconSetting === null || showIconSetting === "True") {
        browser.browserAction.setIcon({
            path: value
        });
    } else if (showIconSetting === "False") {
        // If explicitly set to "False", don't show the weather icon
        browser.browserAction.setIcon({
            path: "../res/icons/icon.png"
        });
    } else {
        // Fallback to a default icon if any issues
        browser.browserAction.setIcon({
            path: "../res/icons/icon.png"
        });
    }
}

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

document.addEventListener("DOMContentLoaded", function () {
    initializeLocalStorageDefaults();
    getLatitudeLongitudeAndFetchWeather();
});

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

timeRefresh();
contextMenuFunction();