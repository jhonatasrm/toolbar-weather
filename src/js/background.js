let api = "";
let myStorage = window.localStorage;
let reloadMinutes;
let saveLatitude;
let saveLongitude;

// geolocation
let optionsAccuracy = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

navigator.geolocation.getCurrentPosition(callback, error, optionsAccuracy);

// first weather search
function callback(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // save the latitude and longitude to after
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);

    requestAPI =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&units=metric&type=accurate&appid=" +
        api;
    request.open("GET", requestAPI, true);
    request.responseType = "json";
    request.send();
}

function error() {
    console.log("Error API!");
    navigator.geolocation.getCurrentPosition(callback, error, optionsAccuracy);
}

// time refresh and also set interval to refresh the weather
function timeRefresh() {
    if (localStorage.getItem("timer") == null) {
        reloadMinutes = 15;
        localStorage.setItem("timer", 15);
    } else {
        reloadMinutes = localStorage.getItem("timer");
    }

    setInterval(() => {
        saveLatitude = localStorage.getItem("latitude");
        saveLongitude = localStorage.getItem("longitude");
        requestAPI =
            "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            saveLatitude +
            "&lon=" +
            saveLongitude +
            "&units=metric&type=accurate&appid=" +
            api;
        console.log(
            "Refreshing the weather data after " + reloadMinutes + " minutes."
        );
        request.open("GET", requestAPI, true);
        request.responseType = "json";
        request.send();
    }, reloadMinutes * 60 * 1000);
}

timeRefresh();

let requestAPI = "";
let request = new XMLHttpRequest();

// notifications update
var updateNotification;

// getting elements by id
var city = document.getElementById("city");
var imageWeather = document.getElementById("imageWeather");
var description = document.getElementById("description");
var temperature = document.getElementById("temperature");
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
var gust = document.getElementById("gust");
var tempMin = document.getElementById("temperatureMin");
var tempMax = document.getElementById("temperatureMax");

var dayTomorrow = document.getElementById("tomorrow");
var dayAfterTomorrow = document.getElementById("afterTomorrow");
var tempMinTomorrow = document.getElementById("tempMinTomorrow");
var tempMinAfterTomorrow = document.getElementById("tempMinAfterTomorrow");
var tempMaxTomorrow = document.getElementById("tempMaxTomorrow");
var tempMaxAfterTomorrow = document.getElementById("tempMaxAfterTomorrow");
var weatherTomorrow = document.getElementById("weatherTomorrow");
var weatherAfterTomorrow = document.getElementById("weatherAfterTomorrow");
var imageWeatherTomorrow = document.getElementById("imageWeatherTomorrow");
var imageWeatherAfterTomorrow = document.getElementById("imageWeatherAfterTomorrow");

// getting preferences elements by id
var preferences = document.getElementById("preferences");
var preferencesPanel = document.getElementById("preferencesPanel");
var forecastPanel = document.getElementById("forecastPanel");
var mainPanel = document.getElementById("mainPanel");
var loading = document.getElementById("loading");
// var plus = document.getElementById("plus");
// var minus = document.getElementById("minus");
var outPreferences = document.getElementById("outPreferences");
var save = document.getElementById("save");
var resultSuccess = document.getElementById("resultSuccess");

myStorage.setItem("dayTomorrow", browser.i18n.getMessage("tomorrow"));
myStorage.setItem("dayAfterTomorrow", browser.i18n.getMessage("next48Hours"));

// saved values
var savedImageWeather = myStorage.getItem("forecastWeather") ? myStorage.getItem("forecastWeather") : '../res/icons/weather_popup/04n.png';
var savedDescriptionResult = myStorage.getItem("description") ? myStorage.getItem("description") : 'loading';
var savedCityResult = myStorage.getItem("city") ? myStorage.getItem("city") : 'loading';
var savedTemperatureResult = myStorage.getItem("temperature") ? myStorage.getItem("temperature") : 'loading';
var savedHumidityResult = myStorage.getItem("humidity") ? myStorage.getItem("humidity") : 'loading';
var savedWindResult = myStorage.getItem("wind") ? myStorage.getItem("wind") : 'loading';
var savedGustResult = myStorage.getItem("gust") ? myStorage.getItem("gust") : 'loading';
var savedTemperatureMin = myStorage.getItem("temperatureMin") ? myStorage.getItem("temperatureMin") : 'loading';
var savedTemperatureMax = myStorage.getItem("temperatureMax") ? myStorage.getItem("temperatureMax") : 'loading';

var savedDayTomorrow = myStorage.getItem("dayTomorrow");
var savedDayAfterTomorrow = myStorage.getItem("dayAfterTomorrow");

var savedWeatherTomorrow = myStorage.getItem("weatherTomorrow");
var savedWeatherAfterTomorrow = myStorage.getItem("weatherAfterTomorrow");
var savedImageWeatherTomorrow = myStorage.getItem("imageWeatherTomorrow");
var savedImageWeatherAfterTomorrow = myStorage.getItem("imageWeatherAfterTomorrow");

var savedTempMinTomorrow = myStorage.getItem("tempMinTomorrow");
var savedTempMaxTomorrow = myStorage.getItem("tempMaxTomorrow");
var savedTempMinAfterTomorrow = myStorage.getItem("tempMinAfterTomorrow");
var savedTempMaxAfterTomorrow = myStorage.getItem("tempMaxAfterTomorrow");

// recover values
try {
    imageWeather.src = savedImageWeather;
    description.textContent = savedDescriptionResult;
    city.textContent = savedCityResult;
    temperature.textContent = savedTemperatureResult;
    temperatureMin.textContent = savedTemperatureMin;
    temperatureMax.textContent = savedTemperatureMax;
    humidity.textContent = savedHumidityResult;
    wind.textContent = savedWindResult;
    gust.textContent = savedGustResult;

    weatherTomorrow.textContent = savedWeatherTomorrow;
    weatherAfterTomorrow.textContent = savedWeatherAfterTomorrow;
    imageWeatherTomorrow.src = savedImageWeatherTomorrow;
    imageWeatherAfterTomorrow.src = savedImageWeatherAfterTomorrow;
    tempMinTomorrow.textContent = savedTempMinTomorrow;
    tempMinAfterTomorrow.textContent = savedTempMinAfterTomorrow;
    tempMaxTomorrow.textContent = savedTempMaxTomorrow;
    tempMaxAfterTomorrow.textContent = savedTempMaxAfterTomorrow;
    dayTomorrow.textContent = savedDayTomorrow;
    dayAfterTomorrow.textContent = savedDayAfterTomorrow;
} catch (e) {}

request.onload = function() {
    try {
        var toolbarWeather = request.response;
        city.textContent = toolbarWeather.city.name;
        humidity.textContent = toolbarWeather.list[0].main.humidity + " %";

        //color of separator in popup
        if (!toolbarWeather.list[0].weather[0].icon.includes('n')) {
            document.getElementById("imageWeather").style.filter = "grayscale(0%)";
            document.getElementById("separator1").style.background = "#E1EBF2";
            document.getElementById("separator2").style.background = "#E1EBF2";
            document.getElementById("separator3").style.background = "#E1EBF2";
            document.getElementById("separator4").style.background = "#E1EBF2";
            document.getElementById("separator5").style.background = "#E1EBF2";
            document.getElementById("separator6").style.background = "#E1EBF2";
            document.getElementById("imageWeatherTomorrow").style.filter = "grayscale(0%)";
            document.getElementById("imageWeatherAfterTomorrow").style.filter = "grayscale(0%)";
            document.getElementById("loading").style.display = "none";
            setTimeout(function() {
                forecastPanel.style.display = "inline";
            }, 500);
        } else {
            document.getElementById("imageWeather").style.filter = "grayscale(0%)";
            document.getElementById("separator1").style.background = "#DCD5F2";
            document.getElementById("separator2").style.background = "#DCD5F2";
            document.getElementById("separator3").style.background = "#DCD5F2";
            document.getElementById("separator4").style.background = "#DCD5F2";
            document.getElementById("separator5").style.background = "#DCD5F2";
            document.getElementById("separator6").style.background = "#DCD5F2";
            document.getElementById("imageWeatherTomorrow").style.filter = "grayscale(0%)";
            document.getElementById("imageWeatherAfterTomorrow").style.filter = "grayscale(0%)";
            document.getElementById("loading").style.display = "none";
            setTimeout(function() {
                forecastPanel.style.display = "inline";
            }, 500);
        }

        imageWeather.src = "../res/icons/weather_popup/" + toolbarWeather.list[0].weather[0].icon + ".png";
        imageWeatherTomorrow.src = "../res/icons/weather_popup/" + toolbarWeather.list[8].weather[0].icon + ".png";
        imageWeatherAfterTomorrow.src = "../res/icons/weather_popup/" + toolbarWeather.list[16].weather[0].icon + ".png";

        var speed;
        if (localStorage.getItem("speedRadio") == "mph") {
            speed = toolbarWeather.list[0].wind.speed.toFixed(2);
            wind.textContent = toolbarWeather.list[0].wind.speed.toFixed(2) + " mph";
            localStorage.setItem("speed", speed);
        } else {
            speed = (toolbarWeather.list[0].wind.speed * 1.60934).toFixed(2);
            wind.textContent = (toolbarWeather.list[0].wind.speed * 1.60934).toFixed(2) + " km/h";
            localStorage.setItem("speed", speed);
        }

        if (myStorage.getItem("temperatureRadio") == "F") {
            temperature.textContent =
                parseInt((toolbarWeather.list[0].main.temp * 9) / 5 + 32) + "°F";
            tempMin.textContent =
                ((toolbarWeather.list[0].main.temp_min * 9) / 5 + 32).toFixed(1) + "°F";
            tempMax.textContent =
                ((toolbarWeather.list[0].main.temp_max * 9) / 5 + 32).toFixed(1) + "°F";
            tempMinTomorrow.textContent =
                ((toolbarWeather.list[8].main.temp_min * 9) / 5 + 32).toFixed(1) + "°F"; // min tomorrow
            tempMaxTomorrow.textContent =
                ((toolbarWeather.list[8].main.temp_max * 9) / 5 + 32).toFixed(1) + "°F"; // min tomorrow
            tempMinAfterTomorrow.textContent =
                ((toolbarWeather.list[16].main.temp_min * 9) / 5 + 32).toFixed(1) + "°F"; // min tomorrow
            tempMaxAfterTomorrow.textContent =
                ((toolbarWeather.list[16].main.temp_max * 9) / 5 + 32).toFixed(1) + "°F"; // min tomorrow

            // save
            myStorage.setItem(
                "tempMinTomorrow",
                ((toolbarWeather.list[8].main.temp_min * 9) / 5 + 32).toFixed(1) + "°F"
            ); // min tomorrow
            myStorage.setItem(
                "tempMinAfterTomorrow",
                ((toolbarWeather.list[16].main.temp_min * 9) / 5 + 32).toFixed(1) + "°F"
            ); // min tomorrow
            myStorage.setItem(
                "tempMaxTomorrow",
                ((toolbarWeather.list[8].main.temp_max * 9) / 5 + 32).toFixed(1) + "°F"
            ); // min tomorrow
            myStorage.setItem(
                "tempMaxAfterTomorrow",
                ((toolbarWeather.list[16].main.temp_max * 9) / 5 + 32).toFixed(1) + "°F"
            ); // min tomorrow

            myStorage.setItem(
                "temperature",
                parseInt((toolbarWeather.list[0].main.temp * 9) / 5 + 32) + "°F"
            );
            myStorage.setItem(
                "temperatureMin",
                ((toolbarWeather.list[0].main.temp_min * 9) / 5 + 32).toFixed(1) + "°F"
            );
            myStorage.setItem(
                "temperatureMax",
                ((toolbarWeather.list[0].main.temp_max * 9) / 5 + 32).toFixed(1) + "°F"
            );
        } else {
            temperature.textContent = parseInt(toolbarWeather.list[0].main.temp) + "°C";
            tempMin.textContent = toolbarWeather.list[0].main.temp_min + "°C";
            tempMax.textContent = toolbarWeather.list[0].main.temp_max + "°C";
            tempMinTomorrow.textContent = toolbarWeather.list[8].main.temp_min + "°C"; // min tomorrow C
            tempMinAfterTomorrow.textContent =
                toolbarWeather.list[16].main.temp_min + "°C"; // min after tomorrow c
            tempMaxTomorrow.textContent = toolbarWeather.list[8].main.temp_max + "°C"; // max tomorrow C
            tempMaxAfterTomorrow.textContent =
                toolbarWeather.list[16].main.temp_max + "°C"; // max after tomorrow C

            // save
            myStorage.setItem(
                "tempMinTomorrow",
                toolbarWeather.list[8].main.temp_min + "°C"
            );
            myStorage.setItem(
                "tempMinAfterTomorrow",
                toolbarWeather.list[16].main.temp_min + "°C"
            );
            myStorage.setItem(
                "tempMaxTomorrow",
                toolbarWeather.list[8].main.temp_max + "°C"
            );
            myStorage.setItem(
                "tempMaxAfterTomorrow",
                toolbarWeather.list[16].main.temp_max + "°C"
            );

            myStorage.setItem(
                "temperature",
                parseInt(toolbarWeather.list[0].main.temp) + "°C"
            );
            myStorage.setItem(
                "temperatureMin",
                toolbarWeather.list[0].main.temp_min + "°C"
            );
            myStorage.setItem(
                "temperatureMax",
                toolbarWeather.list[0].main.temp_max + "°C"
            );
        }

        if (toolbarWeather.list[0].wind.speed == null) {
            if (localStorage.getItem("speedRadio") == "mph") {
                gust.textContent = "0 mph";
                var currentGust = "0 mph";
            } else {
                gust.textContent = "0 km/h";
                var currentGust = "0 km/h";
            }
        } else {
            if (localStorage.getItem("speedRadio") == "mph") {
                gust.textContent = toolbarWeather.list[0].wind.speed.toFixed(2) + " mph";
                var currentGust = toolbarWeather.list[0].wind.speed.toFixed(2) + " mph";
            } else {
                gust.textContent =
                    (toolbarWeather.list[0].wind.speed * 1.60934).toFixed(2) + " km/h";
                var currentGust =
                    (toolbarWeather.list[0].wind.speed * 1.60934).toFixed(2) + " km/h";
            }
        }

        if (toolbarWeather.list[0].weather[0].id == 800) {
            description.textContent = browser.i18n.getMessage("clearSky");
            var currentDescription = browser.i18n.getMessage("clearSky");
        } else if (toolbarWeather.list[0].weather[0].id == 801) {
            description.textContent = browser.i18n.getMessage("fewClouds");
            var currentDescription = browser.i18n.getMessage("fewClouds");
        } else if (toolbarWeather.list[0].weather[0].id == 802) {
            description.textContent = browser.i18n.getMessage("scatteredClouds");
            var currentDescription = browser.i18n.getMessage("scatteredClouds");
        } else if (
            toolbarWeather.list[0].weather[0].id >= 803 &&
            toolbarWeather.list[0].weather[0].id <= 804
        ) {
            description.textContent = browser.i18n.getMessage("brokenClouds");
            var currentDescription = browser.i18n.getMessage("brokenClouds");
        } else if (
            toolbarWeather.list[0].weather[0].id >= 300 &&
            toolbarWeather.list[0].weather[0].id <= 321
        ) {
            description.textContent = browser.i18n.getMessage("showerRain");
            var currentDescription = browser.i18n.getMessage("showerRain");
        } else if (
            toolbarWeather.list[0].weather[0].id >= 600 &&
            toolbarWeather.list[0].weather[0].id <= 622
        ) {
            description.textContent = browser.i18n.getMessage("snow");
            var currentDescription = browser.i18n.getMessage("snow");
        } else if (
            toolbarWeather.list[0].weather[0].id >= 701 &&
            toolbarWeather.list[0].weather[0].id <= 781
        ) {
            description.textContent = browser.i18n.getMessage("mist");
            var currentDescription = browser.i18n.getMessage("mist");
        } else if (
            toolbarWeather.list[0].weather[0].id >= 200 &&
            toolbarWeather.list[0].weather[0].id <= 232
        ) {
            description.textContent = browser.i18n.getMessage("thunderstorm");
        } else if (
            toolbarWeather.list[0].weather[0].id >= 500 &&
            toolbarWeather.list[0].weather[0].id <= 504
        ) {
            description.textContent = browser.i18n.getMessage("rain");
            var currentDescription = browser.i18n.getMessage("rain");
        }

        // tomorrow weather
        if (toolbarWeather.list[8].weather[0].id == 800) {
            weatherTomorrow.textContent = browser.i18n.getMessage("clearSky");
            var currentWeatherTomorrow = browser.i18n.getMessage("clearSky");
        } else if (toolbarWeather.list[8].weather[0].id == 801) {
            weatherTomorrow.textContent = browser.i18n.getMessage("fewClouds");
            var currentWeatherTomorrow = browser.i18n.getMessage("fewClouds");
        } else if (toolbarWeather.list[8].weather[0].id == 802) {
            weatherTomorrow.textContent = browser.i18n.getMessage("scatteredClouds");
            var currentWeatherTomorrow = browser.i18n.getMessage("scatteredClouds");
        } else if (
            toolbarWeather.list[8].weather[0].id >= 803 &&
            toolbarWeather.list[8].weather[0].id <= 804
        ) {
            weatherTomorrow.textContent = browser.i18n.getMessage("brokenClouds");
            var currentWeatherTomorrow = browser.i18n.getMessage("brokenClouds");
        } else if (
            toolbarWeather.list[8].weather[0].id >= 300 &&
            toolbarWeather.list[8].weather[0].id <= 321
        ) {
            weatherTomorrow.textContent = browser.i18n.getMessage("showerRain");
            var currentWeatherTomorrow = browser.i18n.getMessage("showerRain");
        } else if (
            toolbarWeather.list[8].weather[0].id >= 600 &&
            toolbarWeather.list[8].weather[0].id <= 622
        ) {
            weatherTomorrow.textContent = browser.i18n.getMessage("snow");
            var currentWeatherTomorrow = browser.i18n.getMessage("snow");
        } else if (
            toolbarWeather.list[8].weather[0].id >= 701 &&
            toolbarWeather.list[8].weather[0].id <= 781
        ) {
            weatherTomorrow.textContent = browser.i18n.getMessage("mist");
            var currentWeatherTomorrow = browser.i18n.getMessage("mist");
        } else if (
            toolbarWeather.list[8].weather[0].id >= 200 &&
            toolbarWeather.list[8].weather[0].id <= 232
        ) {
            weatherTomorrow.textContent = browser.i18n.getMessage("thunderstorm");
        } else if (
            toolbarWeather.list[8].weather[0].id >= 500 &&
            toolbarWeather.list[8].weather[0].id <= 504
        ) {
            weatherTomorrow.textContent = browser.i18n.getMessage("rain");
            var currentWeatherTomorrow = browser.i18n.getMessage("rain");
        }

        // after tomorrow weather
        if (toolbarWeather.list[16].weather[0].id == 800) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage("clearSky");
            var currentWeatherAfterTomorrow = browser.i18n.getMessage("clearSky");
        } else if (toolbarWeather.list[16].weather[0].id == 801) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage("fewClouds");
            var currentWeatherAfterTomorrow = browser.i18n.getMessage("fewClouds");
        } else if (toolbarWeather.list[16].weather[0].id == 802) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage(
                "scatteredClouds"
            );
            var currentWeatherAfterTomorrow = browser.i18n.getMessage(
                "scatteredClouds"
            );
        } else if (
            toolbarWeather.list[16].weather[0].id >= 803 &&
            toolbarWeather.list[16].weather[0].id <= 804
        ) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage("brokenClouds");
            var currentWeatherAfterTomorrow = browser.i18n.getMessage("brokenClouds");
        } else if (
            toolbarWeather.list[16].weather[0].id >= 300 &&
            toolbarWeather.list[16].weather[0].id <= 321
        ) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage("showerRain");
            var currentWeatherAfterTomorrow = browser.i18n.getMessage("showerRain");
        } else if (
            toolbarWeather.list[16].weather[0].id >= 600 &&
            toolbarWeather.list[16].weather[0].id <= 622
        ) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage("snow");
            var currentWeatherAfterTomorrow = browser.i18n.getMessage("snow");
        } else if (
            toolbarWeather.list[16].weather[0].id >= 701 &&
            toolbarWeather.list[16].weather[0].id <= 781
        ) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage("mist");
            var currentWeatherAfterTomorrow = browser.i18n.getMessage("mist");
        } else if (
            toolbarWeather.list[16].weather[0].id >= 200 &&
            toolbarWeather.list[16].weather[0].id <= 232
        ) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage("thunderstorm");
        } else if (
            toolbarWeather.list[16].weather[0].id >= 500 &&
            toolbarWeather.list[16].weather[0].id <= 504
        ) {
            weatherAfterTomorrow.textContent = browser.i18n.getMessage("rain");
            var currentWeatherAfterTomorrow = browser.i18n.getMessage("rain");
        }

        // save last update on weather
        myStorage.setItem(
            "imageWeather",
            "../res/icons/weather_popup/" +
            toolbarWeather.list[0].weather[0].icon +
            ".png"
        );
        myStorage.setItem(
            "imageWeatherTomorrow",
            "../res/icons/weather_popup/" +
            toolbarWeather.list[8].weather[0].icon +
            ".png"
        );
        myStorage.setItem(
            "imageWeatherAfterTomorrow",
            "../res/icons/weather_popup/" +
            toolbarWeather.list[16].weather[0].icon +
            ".png"
        );
        myStorage.setItem("description", currentDescription);
        myStorage.setItem("weatherTomorrow", currentWeatherTomorrow);
        myStorage.setItem("weatherAfterTomorrow", currentWeatherAfterTomorrow);
        myStorage.setItem("city", toolbarWeather.city.name);
        myStorage.setItem("humidity", toolbarWeather.list[0].main.humidity + " %");

        if (localStorage.getItem("speedRadio") == "mph") {
            myStorage.setItem(
                "wind",
                toolbarWeather.list[0].wind.speed.toFixed(2) + " mph"
            );
        } else {
            myStorage.setItem(
                "wind",
                (toolbarWeather.list[0].wind.speed * 1.60934).toFixed(2) + " km/h"
            );
        }
        myStorage.setItem("gust", currentGust);
        if (!toolbarWeather.list[0].weather[0].icon.includes('n')) {
            // set background notification color day
            if (localStorage.getItem("pickerBackgroundNotificationDay") == null) {
                browser.browserAction.setBadgeBackgroundColor({
                    color: "#5387E8"
                });
            } else {
                var val = localStorage.getItem("pickerBackgroundNotificationDay");
                browser.browserAction.setBadgeBackgroundColor({
                    color: "#" + val
                });
            }
            // set text color font day
            if (localStorage.getItem("pickerFontNotificationDay") == null) {
                browser.browserAction.setBadgeTextColor({
                    color: "#FFFFFF"
                });
            } else {
                var val = localStorage.getItem("pickerFontNotificationDay");
                browser.browserAction.setBadgeTextColor({
                    color: "#" + val
                });
            }
        } else {
            // set background notification color night
            if (localStorage.getItem("pickerBackgroundNotificationNight") == null) {
                browser.browserAction.setBadgeBackgroundColor({
                    color: "#722C80"
                });
            } else {
                var val = localStorage.getItem("pickerBackgroundNotificationNight");
                browser.browserAction.setBadgeBackgroundColor({
                    color: "#" + val
                });
            }
            // set text color font night
            if (localStorage.getItem("pickerFontNotificationNight") == null) {
                browser.browserAction.setBadgeTextColor({
                    color: "#FFFFFF"
                });
            } else {
                var val = localStorage.getItem("pickerFontNotificationNight");
                browser.browserAction.setBadgeTextColor({
                    color: "#" + val
                });
            }
        }
        showNotificationWeather();
        showWeatherIcon("../res/icons/weather_popup/" + toolbarWeather.list[0].weather[0].icon + ".png");
        localStorage.setItem("badgeWeatherIcon", "../res/icons/weather_popup/" + toolbarWeather.list[0].weather[0].icon + ".png");
    } catch (e) {}
};

function onCreated() {
    if (browser.runtime.lastError) {
        //console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        //console.log("Context Menu created successfully");
    }
}

function contextMenuFunction() {
    if (localStorage.getItem("contextMenu") == "True") {
        browser.menus.create({
                id: "toolbar-weather",
                title: "Toolbar Weather",
                contexts: ["selection"],
            },
            onCreated
        );

        browser.menus.create({
                id: "degree",
                title: browser.i18n.getMessage("degree"),
                contexts: ["all"],
            },
            onCreated
        );

        if (localStorage.getItem("temperatureRadio") == "F") {
            browser.menus.create({
                    id: "C",
                    type: "radio",
                    title: "°C",
                    contexts: ["all"],
                    checked: false,
                },
                onCreated
            );

            browser.menus.create({
                    id: "F",
                    type: "radio",
                    title: "°F",
                    contexts: ["all"],
                    checked: true,
                },
                onCreated
            );
        } else {
            browser.menus.create({
                    id: "C",
                    type: "radio",
                    title: "°C",
                    contexts: ["all"],
                    checked: true,
                },
                onCreated
            );

            browser.menus.create({
                    id: "F",
                    type: "radio",
                    title: "°F",
                    contexts: ["all"],
                    checked: false,
                },
                onCreated
            );
        }

        browser.menus.create({
                id: "separator-1",
                type: "separator",
                contexts: ["all"],
            },
            onCreated
        );

        browser.menus.create({
                id: "speed",
                title: browser.i18n.getMessage("speed"),
                contexts: ["all"],
            },
            onCreated
        );

        if (localStorage.getItem("speedRadio") == "mph") {
            browser.menus.create({
                    id: "mph",
                    type: "radio",
                    title: "mph",
                    contexts: ["all"],
                    checked: true,
                },
                onCreated
            );

            browser.menus.create({
                    id: "kmh",
                    type: "radio",
                    title: "km/h",
                    contexts: ["all"],
                    checked: false,
                },
                onCreated
            );
        } else {
            browser.menus.create({
                    id: "mph",
                    type: "radio",
                    title: "mph",
                    contexts: ["all"],
                    checked: false,
                },
                onCreated
            );

            browser.menus.create({
                    id: "kmh",
                    type: "radio",
                    title: "km/h",
                    contexts: ["all"],
                    checked: true,
                },
                onCreated
            );
        }
    } else {
        browser.menus.remove("toolbar-weather");
        browser.menus.remove("degree");
        browser.menus.remove("C");
        browser.menus.remove("F");
        browser.menus.remove("separator-1");
        browser.menus.remove("speed");
        browser.menus.remove("mph");
        browser.menus.remove("kmh");
    }
}

browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "toolbar-weather":
            contextMenuFunction();
            break;
        case "C":
            localStorage.setItem("temperatureRadio", "C");
            request.onload();
            break;
        case "F":
            localStorage.setItem("temperatureRadio", "F");
            request.onload();
            break;
        case "mph":
            localStorage.setItem("speedRadio", "mph");
            request.onload();
            break;
        case "kmh":
            localStorage.setItem("speedRadio", "km");
            request.onload();
            break;
    }
});

function showNotificationWeather() {
    if (localStorage.getItem("showTemperature") == null) {
        updateNotification = myStorage.getItem("temperature");
    } else if (localStorage.getItem("showTemperature") == "True") {
        updateNotification = myStorage.getItem("temperature");
    } else if (localStorage.getItem("showTemperature") == "undefined") {
        updateNotification = myStorage.getItem("temperature");
    } else {
        updateNotification = "";
    }
    // removes the C or F in the badge text notification
    browser.browserAction.setBadgeText({
        text: updateNotification.toString().replace("C", "").replace("F", "")
    });
}

function showWeatherIcon(value) {
    if (localStorage.getItem("showWeatherIcon") == null) {
        browser.browserAction.setIcon({
            path: value
        });
    } else if (localStorage.getItem("showWeatherIcon") == "True") {
        browser.browserAction.setIcon({
            path: value
        });
    } else if (localStorage.getItem("showWeatherIcon") == "undefined") {
        browser.browserAction.setIcon({
            path: value
        });
    } else {
        browser.browserAction.setIcon({
            path: "../res/icons/icon.png"
        });
    }
}