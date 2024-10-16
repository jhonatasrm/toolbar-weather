    let api = "";
    let myStorage = window.localStorage;
    let reloadMinutes;
    let saveLatitude;
    let saveLongitude;

    const savedLocation = myStorage.getItem("savedLocation");
    initializeLocalStorageDefaults();  // Ensure all localStorage items are set

    if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        saveLatitude = locationData.lat;
        saveLongitude = locationData.lng;
        fetchWeatherData(saveLatitude, saveLongitude);
    } else {
        navigator.geolocation.getCurrentPosition(callback, error, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    }

    function callback(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        myStorage.setItem("savedLocation", JSON.stringify({ lat: latitude, lng: longitude }));
        fetchWeatherData(latitude, longitude);
    }

    function error() {
        console.log("Error getting geolocation!");
    }

    function fetchWeatherData(latitude, longitude) {
        var browserLanguage = browser.i18n.getUILanguage().split("-")[0];
        const requestAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&type=accurate&appid=${api}&lang=${browserLanguage}`;
        const request = new XMLHttpRequest();
        request.open("GET", requestAPI, true);
        request.responseType = "json";
        request.onload = function () {
            if (request.status === 200) {
                const toolbarWeather = request.response;
                const weatherNow = toolbarWeather.list[0];
                const weatherTomorrow = toolbarWeather.list[8];
                const weatherAfterTomorrow = toolbarWeather.list[16];

                // Helper function to handle wind speed conversion
                const convertSpeed = (speed, unit) => {
                    return unit === "mph" ? `${speed.toFixed(2)} mph` : `${(speed * 1.60934).toFixed(2)} km/h`;
                };

                // Helper function to handle temperature conversion
                const convertTemp = (temp, unit) => {
                    return unit === "F" ? `${((temp * 9) / 5 + 32).toFixed(1)}°F` : `${temp.toFixed(1)}°C`;
                };

                // Get the speed unit
                const speedUnit = localStorage.getItem("speedRadio") === "mph" ? "mph" : "km/h";
                const windSpeed = convertSpeed(weatherNow.wind.speed ?? 0, speedUnit);

                // Save weather data to myStorage
                myStorage.setItem("city", toolbarWeather.city.name);
                myStorage.setItem("temperature", convertTemp(weatherNow.main.temp, "C"));
                myStorage.setItem("temperatureMin", convertTemp(weatherNow.main.temp_min, "C"));
                myStorage.setItem("temperatureMax", convertTemp(weatherNow.main.temp_max, "C"));
                myStorage.setItem("humidity", `${weatherNow.main.humidity} %`);
                myStorage.setItem("wind", windSpeed);
                myStorage.setItem("gust", windSpeed);
                myStorage.setItem("description", weatherNow.weather[0].description);

                myStorage.setItem("tempMinTomorrow", convertTemp(weatherTomorrow.main.temp_min, "C"));
                myStorage.setItem("tempMaxTomorrow", convertTemp(weatherTomorrow.main.temp_max, "C"));
                myStorage.setItem("tempMinAfterTomorrow", convertTemp(weatherAfterTomorrow.main.temp_min, "C"));
                myStorage.setItem("tempMaxAfterTomorrow", convertTemp(weatherAfterTomorrow.main.temp_max, "C"));

                myStorage.setItem("weatherTomorrow", weatherTomorrow.weather[0].description);
                myStorage.setItem("weatherAfterTomorrow", weatherAfterTomorrow.weather[0].description);

                // Save weather icons
                myStorage.setItem("imageWeather", `../res/icons/weather_popup/${weatherNow.weather[0].icon}.png`);
                myStorage.setItem("imageWeatherTomorrow", `../res/icons/weather_popup/${weatherTomorrow.weather[0].icon}.png`);
                myStorage.setItem("imageWeatherAfterTomorrow", `../res/icons/weather_popup/${weatherAfterTomorrow.weather[0].icon}.png`);

                // Atualizar elementos DOM com os dados de clima
                setTimeout(function () {
                    let cityElement = document.getElementById("city");
                    let descriptionElement = document.getElementById("description");
                
                    if (cityElement && descriptionElement) {
                        cityElement.textContent = toolbarWeather.city.name;
                        descriptionElement.textContent = weatherNow.weather[0].description;
                    } else {
                        console.error("Um ou ambos os elementos não foram encontrados: 'city' ou 'description'.");
                    }
                }, 100);
                
                document.getElementById("temperature").textContent = convertTemp(weatherNow.main.temp, "C");
                document.getElementById("temperatureMin").textContent = convertTemp(weatherNow.main.temp_min, "C");
                document.getElementById("temperatureMax").textContent = convertTemp(weatherNow.main.temp_max, "C");
                document.getElementById("humidity").textContent = `${weatherNow.main.humidity} %`;
                document.getElementById("wind").textContent = windSpeed;
                document.getElementById("gust").textContent = windSpeed;

                // Atualizar previsões de amanhã e depois de amanhã
                document.getElementById("tempMinTomorrow").textContent = convertTemp(weatherTomorrow.main.temp_min, "C");
                document.getElementById("tempMaxTomorrow").textContent = convertTemp(weatherTomorrow.main.temp_max, "C");
                document.getElementById("weatherTomorrow").textContent = weatherTomorrow.weather[0].description;
                document.getElementById("imageWeatherTomorrow").src = `../res/icons/weather_popup/${weatherTomorrow.weather[0].icon}.png`;

                document.getElementById("tempMinAfterTomorrow").textContent = convertTemp(weatherAfterTomorrow.main.temp_min, "C");
                document.getElementById("tempMaxAfterTomorrow").textContent = convertTemp(weatherAfterTomorrow.main.temp_max, "C");
                document.getElementById("weatherAfterTomorrow").textContent = weatherAfterTomorrow.weather[0].description;
                document.getElementById("imageWeatherAfterTomorrow").src = `../res/icons/weather_popup/${weatherAfterTomorrow.weather[0].icon}.png`;

                // Lógica para alterar o tema e o ícone de acordo com o dia ou noite
                if (!toolbarWeather.list[0].weather[0].icon.includes('n')) {
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

                // Esconder o ícone de carregamento e exibir o painel de previsão
                document.getElementById("loading").style.display = "none";
                setTimeout(function () {
                    document.getElementById("forecastPanel").style.display = "inline";
                }, 500);

                console.log("Weather data updated and saved to localStorage.");
            } else {
                console.error("Error searching weather data: ", request.status);
            }
        };

        request.send();
    }

    function updateWeatherUI(toolbarWeather) {
        // city.textContent = toolbarWeather.city.name;
        // temperature.textContent = `${parseInt(toolbarWeather.list[0].main.temp)}°C`;
    }

    function timeRefresh() {
        if (localStorage.getItem("timer") == null) {
            reloadMinutes = 15;
            localStorage.setItem("timer", 15);
        } else {
            reloadMinutes = localStorage.getItem("timer");
        }

        setInterval(() => {
            const savedLocation = JSON.parse(localStorage.getItem("savedLocation"));
            if (savedLocation) {
                saveLatitude = savedLocation.lat;
                saveLongitude = savedLocation.lng;
                fetchWeatherData(saveLatitude, saveLongitude);
            }
            console.log("Atualizando os dados do clima após " + reloadMinutes + " minutos.");
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
        showWeatherIcon(savedImageWeather); 
        showNotificationWeather();
        setBadgeColors();       
    } catch (e) { } 

    request.onload = function () {
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
                setTimeout(function () {
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
                setTimeout(function () {
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
                description.textContent = toolbarWeather.list[0].weather[0].description;
                var currentDescription = toolbarWeather.list[0].weather[0].description;
            } else if (toolbarWeather.list[0].weather[0].id == 801) {
                description.textContent = toolbarWeather.list[0].weather[0].description;
                var currentDescription = toolbarWeather.list[0].weather[0].description;
            } else if (toolbarWeather.list[0].weather[0].id == 802) {
                description.textContent = toolbarWeather.list[0].weather[0].description;
                var currentDescription = toolbarWeather.list[0].weather[0].description;
            } else if (
                toolbarWeather.list[0].weather[0].id >= 803 &&
                toolbarWeather.list[0].weather[0].id <= 804
            ) {
                description.textContent = toolbarWeather.list[0].weather[0].description;
                var currentDescription = toolbarWeather.list[0].weather[0].description;
            } else if (
                toolbarWeather.list[0].weather[0].id >= 300 &&
                toolbarWeather.list[0].weather[0].id <= 321
            ) {
                description.textContent = toolbarWeather.list[0].weather[0].description;
                var currentDescription = toolbarWeather.list[0].weather[0].description;
            } else if (
                toolbarWeather.list[0].weather[0].id >= 600 &&
                toolbarWeather.list[0].weather[0].id <= 622
            ) {
                description.textContent = toolbarWeather.list[0].weather[0].description;
                var currentDescription = toolbarWeather.list[0].weather[0].description;
            } else if (
                toolbarWeather.list[0].weather[0].id >= 701 &&
                toolbarWeather.list[0].weather[0].id <= 781
            ) {
                description.textContent = toolbarWeather.list[0].weather[0].description;
                var currentDescription = toolbarWeather.list[0].weather[0].description;
            } else if (
                toolbarWeather.list[0].weather[0].id >= 200 &&
                toolbarWeather.list[0].weather[0].id <= 232
            ) {
                description.textContent = toolbarWeather.list[0].weather[0].description;
            } else if (
                toolbarWeather.list[0].weather[0].id >= 500 &&
                toolbarWeather.list[0].weather[0].id <= 504
            ) {
                description.textContent = toolbarWeather.list[0].weather[0].description;
                var currentDescription = toolbarWeather.list[0].weather[0].description;
            }

            // tomorrow weather
            if (toolbarWeather.list[8].weather[0].id == 800) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
                var currentWeatherTomorrow = toolbarWeather.list[8].weather[0].description;
            } else if (toolbarWeather.list[8].weather[0].id == 801) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
                var currentWeatherTomorrow = toolbarWeather.list[8].weather[0].description;
            } else if (toolbarWeather.list[8].weather[0].id == 802) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
                var currentWeatherTomorrow = toolbarWeather.list[8].weather[0].description;
            } else if (
                toolbarWeather.list[8].weather[0].id >= 803 &&
                toolbarWeather.list[8].weather[0].id <= 804
            ) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
                var currentWeatherTomorrow = toolbarWeather.list[8].weather[0].description;
            } else if (
                toolbarWeather.list[8].weather[0].id >= 300 &&
                toolbarWeather.list[8].weather[0].id <= 321
            ) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
                var currentWeatherTomorrow = toolbarWeather.list[8].weather[0].description;
            } else if (
                toolbarWeather.list[8].weather[0].id >= 600 &&
                toolbarWeather.list[8].weather[0].id <= 622
            ) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
                var currentWeatherTomorrow = toolbarWeather.list[8].weather[0].description;
            } else if (
                toolbarWeather.list[8].weather[0].id >= 701 &&
                toolbarWeather.list[8].weather[0].id <= 781
            ) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
                var currentWeatherTomorrow = toolbarWeather.list[8].weather[0].description;
            } else if (
                toolbarWeather.list[8].weather[0].id >= 200 &&
                toolbarWeather.list[8].weather[0].id <= 232
            ) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
            } else if (
                toolbarWeather.list[8].weather[0].id >= 500 &&
                toolbarWeather.list[8].weather[0].id <= 504
            ) {
                weatherTomorrow.textContent = toolbarWeather.list[8].weather[0].description;
                var currentWeatherTomorrow = toolbarWeather.list[8].weather[0].description;
            }

            // after tomorrow weather
            if (toolbarWeather.list[16].weather[0].id == 800) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
                var currentWeatherAfterTomorrow = toolbarWeather.list[16].weather[0].description;
            } else if (toolbarWeather.list[16].weather[0].id == 801) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
                var currentWeatherAfterTomorrow = toolbarWeather.list[16].weather[0].description;
            } else if (toolbarWeather.list[16].weather[0].id == 802) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
                var currentWeatherAfterTomorrow = toolbarWeather.list[16].weather[0].description;
            } else if (
                toolbarWeather.list[16].weather[0].id >= 803 &&
                toolbarWeather.list[16].weather[0].id <= 804
            ) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
                var currentWeatherAfterTomorrow = toolbarWeather.list[16].weather[0].description;
            } else if (
                toolbarWeather.list[16].weather[0].id >= 300 &&
                toolbarWeather.list[16].weather[0].id <= 321
            ) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
                var currentWeatherAfterTomorrow = toolbarWeather.list[16].weather[0].description;
            } else if (
                toolbarWeather.list[16].weather[0].id >= 600 &&
                toolbarWeather.list[16].weather[0].id <= 622
            ) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
                var currentWeatherAfterTomorrow = toolbarWeather.list[16].weather[0].description;
            } else if (
                toolbarWeather.list[16].weather[0].id >= 701 &&
                toolbarWeather.list[16].weather[0].id <= 781
            ) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
                var currentWeatherAfterTomorrow = toolbarWeather.list[16].weather[0].description;
            } else if (
                toolbarWeather.list[16].weather[0].id >= 200 &&
                toolbarWeather.list[16].weather[0].id <= 232
            ) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
            } else if (
                toolbarWeather.list[16].weather[0].id >= 500 &&
                toolbarWeather.list[16].weather[0].id <= 504
            ) {
                weatherAfterTomorrow.textContent = toolbarWeather.list[16].weather[0].description;
                var currentWeatherAfterTomorrow = toolbarWeather.list[16].weather[0].description;
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
        } catch (e) { }
    };

    function onCreated() {
        if (browser.runtime.lastError) {
            console.log(`Error: ${browser.runtime.lastError}`);
        } else {
            console.log("Context Menu created successfully");
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
        const isDayTime = !myStorage.getItem("imageWeather").includes('n');
    
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

    function initializeLocalStorageDefaults() {
        if (localStorage.getItem("speedRadio") === null) {
            localStorage.setItem("speedRadio", "km");  // Default to km if not set
        }

        if (localStorage.getItem("temperatureRadio") === null) {
            localStorage.setItem("temperatureRadio", "C");  // Default to Celsius if not set
        }

        if (localStorage.getItem("contextMenu") === null) {
            localStorage.setItem("contextMenu", "True");  // Default to showing context menu
        }

        if (localStorage.getItem("timer") === null) {
            localStorage.setItem("timer", 15);  // Default refresh timer set to 15 minutes
        }

        if (localStorage.getItem("pickerBackgroundNotificationDay") === null) {
            localStorage.setItem("pickerBackgroundNotificationDay", "#5387E8");  // Default day color
        }

        if (localStorage.getItem("pickerBackgroundNotificationNight") === null) {
            localStorage.setItem("pickerBackgroundNotificationNight", "#722C80");  // Default night color
        }

        if (localStorage.getItem("pickerFontNotificationDay") === null) {
            localStorage.setItem("pickerFontNotificationDay", "#FFFFFF");  // Default day font color
        }

        if (localStorage.getItem("pickerFontNotificationNight") === null) {
            localStorage.setItem("pickerFontNotificationNight", "#FFFFFF");  // Default night font color
        }

        if (localStorage.getItem("showTemperature") === null) {
            localStorage.setItem("showTemperature", "True");  // Default to showing temperature
        }

        if (localStorage.getItem("showWeatherIcon") === null) {
            localStorage.setItem("showWeatherIcon", "True");  // Default to showing weather icon
        }
    }       