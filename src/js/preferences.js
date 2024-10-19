// Access the background page to refresh data when preferences are updated
var backgroundPage = browser.extension.getBackgroundPage();

// Display the version information by retrieving it from the manifest
var version = document.getElementById("version");
version.textContent = browser.runtime.getManifest().name + " (v" + browser.runtime.getManifest().version + ")";
const openCageApiKey = '';

// Get the saved location's coordinates and fetch weather data if available, otherwise get current geolocation
function getCoordinatesAndFetchWeather() {
    const savedLocation = localStorage.getItem('savedLocation');
    let latitude, longitude;

    if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        if (locationData.lat && locationData.lng) {
            latitude = locationData.lat;
            longitude = locationData.lng;
        }
    }

    if (!latitude || !longitude) {
        getGeolocationAndFetchWeather();
    } else {
        if (backgroundPage && typeof backgroundPage.fetchWeatherData === 'function') {
            backgroundPage.fetchWeatherData(latitude, longitude);
        } else {
            console.error("fetchWeatherData is not defined in background page.");
        }
    }
}

// Get current geolocation from the user and fetch weather data using those coordinates
function getGeolocationAndFetchWeather() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            localStorage.setItem('savedLocation', JSON.stringify({ lat: latitude, lng: longitude }));
            if (backgroundPage && typeof backgroundPage.fetchWeatherData === 'function') {
                backgroundPage.fetchWeatherData(latitude, longitude);
            } else {
                console.error("fetchWeatherData is not defined in backgr    ound page.");
            }
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

// Initialize the timer settings from localStorage and listen for user changes to update the value
$(document).ready(function () {
    var timer = document.getElementById("timer");
    var val = localStorage.getItem('timer');
    timer.value = val ? val : 15;

    $('input[name="timer"]').on('change', function () {
        localStorage.setItem('timer', $(this).val());
        if (backgroundPage && typeof backgroundPage.timeRefresh === 'function') {
            backgroundPage.timeRefresh();
        }
    });
});

// Listen for changes to notification colors for day and night and update them accordingly
$(document).ready(function () {
    $('#background_notification_day').on('change', function () {
        const color = validateHexColor($(this).val());
        localStorage.setItem('pickerBackgroundNotificationDay', color);
        updateBadgeColorBackgroundDay(color);
    });

    $('#color_font_notification_day').on('change', function () {
        const color = validateHexColor($(this).val());
        localStorage.setItem('pickerFontNotificationDay', color);
        updateBadgeColorTextDay(color);
    });

    $('#background_notification_night').on('change', function () {
        const color = validateHexColor($(this).val());
        localStorage.setItem('pickerBackgroundNotificationNight', color);
        updateBadgeColorBackgroundNight(color);
    });

    $('#color_font_notification_night').on('change', function () {
        const color = validateHexColor($(this).val());
        localStorage.setItem('pickerFontNotificationNight', color);
        updateBadgeColorTextNight(color);
    });
});

// Load color preferences from localStorage and initialize the color input fields
$(document).ready(function () {
    var bgColorDay = localStorage.getItem('pickerBackgroundNotificationDay') || '5387E8';
    var fontColorDay = localStorage.getItem('pickerFontNotificationDay') || 'FFFFFF';
    var bgColorNight = localStorage.getItem('pickerBackgroundNotificationNight') || '722C80';
    var fontColorNight = localStorage.getItem('pickerFontNotificationNight') || 'FFFFFF';

    bgColorDay = validateHexColor(bgColorDay);
    fontColorDay = validateHexColor(fontColorDay);
    bgColorNight = validateHexColor(bgColorNight);
    fontColorNight = validateHexColor(fontColorNight);

    $('#background_notification_day').val(bgColorDay);
    $('#color_font_notification_day').val(fontColorDay);
    $('#background_notification_night').val(bgColorNight);
    $('#color_font_notification_night').val(fontColorNight);

    $('#background_notification_day').css('background-color', bgColorDay);
    $('#color_font_notification_day').css('background-color', fontColorDay);
    $('#background_notification_night').css('background-color', bgColorNight);
    $('#color_font_notification_night').css('background-color', fontColorNight);

    jscolor.installByClassName('jscolor');

    // Update colors dynamically when input values change
    $('#background_notification_day').on('input change', function () {
        const color = validateHexColor($(this).val());
        localStorage.setItem('pickerBackgroundNotificationDay', color);
        updateBadgeColorBackgroundDay(color);
        $(this).val(color);
        $(this).css('background-color', color);
    });

    $('#color_font_notification_day').on('input change', function () {
        const color = validateHexColor($(this).val());
        localStorage.setItem('pickerFontNotificationDay', color);
        updateBadgeColorTextDay(color);
        $(this).val(color);
        $(this).css('background-color', color);
    });

    $('#background_notification_night').on('input change', function () {
        const color = validateHexColor($(this).val());
        localStorage.setItem('pickerBackgroundNotificationNight', color);
        updateBadgeColorBackgroundNight(color);
        $(this).val(color);
        $(this).css('background-color', color);
    });

    $('#color_font_notification_night').on('input change', function () {
        const color = validateHexColor($(this).val());
        localStorage.setItem('pickerFontNotificationNight', color);
        updateBadgeColorTextNight(color);
        $(this).val(color);
        $(this).css('background-color', color);
    });
});

// Validates and ensures the hex color format is correct, adding a "#" if missing
function validateHexColor(color) {
    color = color.trim().replace(/[^0-9a-fA-F]/g, '');
    color = color.slice(0, 6);
    return `#${color.padEnd(6, '0')}`;
}

// Set temperature unit radio buttons from localStorage and listen for changes to update preferences
document.addEventListener('DOMContentLoaded', function () {
    var radios = document.getElementsByName("temperature");
    var val = localStorage.getItem('temperatureRadio') || 'C';

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value === val) {
            radios[i].checked = true;
        }
    }

    document.querySelectorAll('input[name="temperature"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            let selectedUnit = event.target.value;
            localStorage.setItem('temperatureRadio', selectedUnit);

            showNotificationWeatherDegrees();
            getCoordinatesAndFetchWeather();

            browser.runtime.sendMessage({
                action: 'updateTemperatureUnit',
                unit: selectedUnit
            });
        });
    });
});

// Load speed unit preferences and listen for changes to update them in localStorage
$(document).ready(function () {
    var radios = document.getElementsByName("speed");
    var val = localStorage.getItem('speedRadio') || 'km/h';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value === val) {
            radios[i].checked = true;
        }
    }

    $('input[name="speed"]').on('change', function () {
        localStorage.setItem('speedRadio', $(this).val());
        getCoordinatesAndFetchWeather();
    });
});

// Initialize context menu settings and listen for changes to update the background page
$(document).ready(function () {
    var radios = document.getElementsByName("contextMenu");
    var val = localStorage.getItem('contextMenu') || 'True';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value === val) {
            radios[i].checked = true;
        }
    }

    $('input[name="contextMenu"]').on('change', function () {
        localStorage.setItem('contextMenu', $(this).val());
        if (backgroundPage && typeof backgroundPage.contextMenuFunction === 'function') {
            backgroundPage.contextMenuFunction();
        }
    });
});

// Initialize the show temperature radio buttons from localStorage and listen for changes
$(document).ready(function () {
    var radios = document.getElementsByName("showTemperature");
    var val = localStorage.getItem('showTemperature') || 'True';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value === val) {
            radios[i].checked = true;
        }
    }

    $('input[name="showTemperature"]').on('change', function () {
        localStorage.setItem('showTemperature', $(this).val());
        showNotificationWeather();
    });
});

// Initialize the show weather icon preferences and listen for changes to update the badge icon
$(document).ready(function () {
    var radios = document.getElementsByName("showWeatherIcon");
    var val = localStorage.getItem('showWeatherIcon') || 'True';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value === val) {
            radios[i].checked = true;
        }
    }

    $('input[name="showWeatherIcon"]').on('change', function () {
        localStorage.setItem('showWeatherIcon', $(this).val());
        showWeatherIcon(localStorage.getItem("badgeWeatherIcon"));
    });
});

// Updates the browser badge with the current temperature in the selected unit
function showNotificationWeatherDegrees() {
    let temperature = localStorage.getItem('temperature');
    let unit = localStorage.getItem('temperatureRadio') || 'C';
    let temperatureValue = parseFloat(temperature);
    let degreeSymbol = 'º';

    if (!isNaN(temperatureValue)) {
        if (unit === 'F') {
            temperatureValue = (temperatureValue * 9 / 5) + 32;
        }

        const currentBadgeText = `${Math.round(temperatureValue)}${degreeSymbol}`;

        browser.browserAction.getBadgeText({}, function (currentText) {
            if (currentText !== currentBadgeText) {
                console.log("trocou")
                browser.browserAction.setBadgeText({ text: currentBadgeText });
            }
        });
    } else {
        browser.browserAction.setBadgeText({ text: '' });
    }
}

// Show or hide the weather badge based on user preference
function showNotificationWeather() {
    if (localStorage.getItem('showTemperature') === 'False') {
        browser.browserAction.setBadgeText({ text: '' });
    } else {
        showNotificationWeatherDegrees();
    }
}
browserLanguage = browser.i18n.getUILanguage().split("-")[0];

// Debounce function to limit how often suggestions are fetched based on user input
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Load saved location and display it in the input field if available
const savedLocation = localStorage.getItem('savedLocation');
if (savedLocation) {
    const locationData = JSON.parse(savedLocation);
    $('#coordinatesResult').text(`Latitude: ${locationData.lat}, Longitude: ${locationData.lng}`);
    $('#locationInput').val(locationData.name);
}

// Fetch location suggestions based on user input and display them in the suggestions list
const fetchSuggestions = (query) => {
    if (query.length > 3) {
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${openCageApiKey}&language=${browserLanguage}`)
            .then(response => response.json())
            .then(data => {
                const suggestions = data.results;
                const suggestionsList = $('#suggestions');
                suggestionsList.empty();

                if (suggestions.length > 0) {
                    suggestionsList.css('border', '1px solid #d1d5db');
                    suggestions.forEach(result => {
                        const suggestionItem = `<li data-lat="${result.geometry.lat}" data-lng="${result.geometry.lng}">${result.formatted}</li>`;
                        suggestionsList.append(suggestionItem);
                    });
                } else {
                    suggestionsList.css('border', '1px solid #d1d5db');
                    suggestionsList.append('<li>' + browser.i18n.getMessage("noResults") + '</li>');
                }
            })
            .catch(error => {
                $('#suggestions').css('border', 'none');
                console.error('Error fetching suggestions: ', error);
            });
    } else {
        $('#suggestions').empty();
        $('#suggestions').css('border', 'none');
    }
};

// Handle the user's location selection from the suggestions and save it to localStorage
$('#locationInput').on('input', debounce(function () {
    const query = $(this).val();
    fetchSuggestions(query);
}, 600));

// Set the selected location from the suggestions and fetch weather data for that location
$('#suggestions').on('click', 'li', function () {
    const latitude = $(this).data('lat');
    const longitude = $(this).data('lng');
    const locationName = $(this).text();
    $('#suggestions').css('border', 'none');
    $('#suggestions').empty();

    $('#locationInput').val(locationName);

    const locationData = {
        name: locationName,
        lat: latitude,
        lng: longitude
    };
    localStorage.setItem('savedLocation', JSON.stringify(locationData));
    const clearButton = document.getElementById("clearLocation");
    clearButton.style.display = 'inline-block';
    backgroundPage.fetchWeatherData(latitude, longitude);
});

// Manually fetch the coordinates for a location entered by the user and save them to localStorage
$('#geocodeButton').on('click', function () {
    const location = $('#locationInput').val();

    if (location) {
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${openCageApiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const coordinates = data.results[0].geometry;
                    const latitude = coordinates.lat;
                    const longitude = coordinates.lng;

                    const locationData = {
                        name: location,
                        lat: latitude,
                        lng: longitude
                    };
                    localStorage.setItem('savedLocation', JSON.stringify(locationData));
                } else {
                }
            })
            .catch(error => {
                console.error('Error getting coords:', error);
            });
    } else {
    }
});

// Updates the weather icon in the browser action badge based on user preferences
function showWeatherIcon(value) {
    if (localStorage.getItem('showWeatherIcon') === 'False') {
        browser.browserAction.setIcon({ path: "../res/icons/icon.png" });
    } else {
        browser.browserAction.setIcon({ path: value });
    }
}

// Update the badge background color for daytime weather notifications
function updateBadgeColorBackgroundDay(val) {
    if (!val.startsWith('#')) {
        val = `#${val}`;
    }
    if (localStorage.getItem("imageWeather").includes("d.png")) {
        browser.browserAction.setBadgeBackgroundColor({ color: val });
    }
}

// Update the badge text color for daytime weather notifications
function updateBadgeColorTextDay(val) {
    if (!val.startsWith('#')) {
        val = `#${val}`;
    }
    if (localStorage.getItem("imageWeather").includes("d.png")) {
        browser.browserAction.setBadgeTextColor({ color: val });
    }
}

// Update the badge background color for nighttime weather notifications
function updateBadgeColorBackgroundNight(val) {
    if (!val.startsWith('#')) {
        val = `#${val}`;
    }
    if (localStorage.getItem("imageWeather").includes("n.png")) {
        browser.browserAction.setBadgeBackgroundColor({ color: val });
    }
}

// Update the badge text color for nighttime weather notifications
function updateBadgeColorTextNight(val) {
    if (!val.startsWith('#')) {
        val = `#${val}`;
    }
    if (localStorage.getItem("imageWeather").includes("n.png")) {
        browser.browserAction.setBadgeTextColor({ color: val });
    }
}

// Clear the saved location and refresh weather data based on the new location
document.addEventListener("DOMContentLoaded", function () {
    const clearButton = document.getElementById("clearLocation");
    const locationInput = document.getElementById("locationInput");

    function checkSavedLocation() {
        const savedLocation = localStorage.getItem("savedLocation");

        if (savedLocation) {
            const locationData = JSON.parse(savedLocation);

            if (locationData && locationData.name) {
                locationInput.value = locationData.name;
                clearButton.style.display = 'inline-block';
            } else {
                clearButton.style.display = 'none';
            }
        } else {
            clearButton.style.display = 'none';
        }
    }

    // Clear the location when the clear button is clicked and reload weather data
    clearButton.addEventListener("click", function () {
        localStorage.removeItem("savedLocation");
        $('#suggestions').empty();
        $('#suggestions').css('border', 'none');
        locationInput.value = '';
        clearButton.style.display = 'none';
        backgroundPage.getLatitudeLongitudeAndFetchWeather();
    });

    // Show the clear button if the user enters a location
    locationInput.addEventListener('input', function () {
        if (locationInput.value.trim() !== '') {
            clearButton.style.display = 'inline-block';
        } else {
            clearButton.style.display = 'none';
        }
    });

    checkSavedLocation();
});