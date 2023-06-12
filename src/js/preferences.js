// temperature radio
var backgroundPage = browser.extension.getBackgroundPage();
// version
var version = document.getElementById("version");
version.textContent = browser.runtime.getManifest().name + " (v" + browser.runtime.getManifest().version + ")";

$(document).ready(function() {
    var timer = document.getElementById("timer");
    var val = localStorage.getItem('timer');
    if (typeof val !== 'undefined' && val !== null) {
        timer.value = localStorage.getItem('timer');
    } else {
        timer.value = 15;
    }
    $('input[name="timer"]').on('change', function() {
        localStorage.setItem('timer', $(this).val());
        backgroundPage.timeRefresh();
    });
});

// C or F
$(document).ready(function() {
    var radios = document.getElementsByName("temperature");
    var val = localStorage.getItem('temperatureRadio');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value == val) {
            radios[i].checked = true;
        }
    }
    $('input[name="temperature"]').on('change', function() {
        localStorage.setItem('temperatureRadio', $(this).val());
        showNotificationWeatherDegrees();
    });
});


// speed radio
$(document).ready(function() {
    var radios = document.getElementsByName("speed");
    var val = localStorage.getItem('speedRadio');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value == val) {
            radios[i].checked = true;
        }
    }
    $('input[name="speed"]').on('change', function() {
        localStorage.setItem('speedRadio', $(this).val());
    });
});

// context menu
$(document).ready(function() {
    var radios = document.getElementsByName("contextMenu");
    var val = localStorage.getItem('contextMenu');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value == val) {
            radios[i].checked = true;
        }
    }
    $('input[name="contextMenu"]').on('change', function() {
        localStorage.setItem('contextMenu', $(this).val());
        backgroundPage.contextMenuFunction();
    });
});

// temperature toolbar
$(document).ready(function() {
    var radios = document.getElementsByName("showTemperature");
    var val = localStorage.getItem('showTemperature');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value == val) {
            radios[i].checked = true;
        }
    }
    $('input[name="showTemperature"]').on('change', function() {
        localStorage.setItem('showTemperature', $(this).val());
        showNotificationWeather();
    });
});

// icon weather
$(document).ready(function() {
    var radios = document.getElementsByName("showWeatherIcon");
    var val = localStorage.getItem('showWeatherIcon');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value == val) {
            radios[i].checked = true;
        }
    }
    $('input[name="showWeatherIcon"]').on('change', function() {
        localStorage.setItem('showWeatherIcon', $(this).val());
        showWeatherIcon(localStorage.getItem("badgeWeatherIcon"));
    });
});

// color picker day > background color
$(document).ready(function() {
    var background_color_day = document.getElementById("background_notification_day");
    var val = localStorage.getItem("pickerBackgroundNotificationDay");
    if (typeof val !== 'undefined' && val !== null) {
        background_color_day.value = localStorage.getItem('pickerBackgroundNotificationDay');
    } else {
        background_color_day.value = "5387E8";
    }
    $('input[name="background_notification_day"]').on('change', function() {
        localStorage.setItem('pickerBackgroundNotificationDay', $(this).val());
        updateBadgeColorBackgroundDay($(this).val());
    });
});

// color picker day > font color
$(document).ready(function() {
    var background_color_day = document.getElementById("color_font_notification_day");
    var val = localStorage.getItem("pickerFontNotificationDay");
    if (typeof val !== 'undefined' && val !== null) {
        background_color_day.value = localStorage.getItem('pickerFontNotificationDay');
    } else {
        background_color_day.value = "FFFFFF";
    }
    $('input[name="color_font_notification_day"]').on('change', function() {
        localStorage.setItem('pickerFontNotificationDay', $(this).val());
        updateBadgeColorTextDay($(this).val());
    });
});

// color picker night > background color
$(document).ready(function() {
    var background_color_night = document.getElementById("background_notification_night");
    var val = localStorage.getItem("pickerBackgroundNotificationNight");
    if (typeof val !== 'undefined' && val !== null) {
        background_color_night.value = localStorage.getItem('pickerBackgroundNotificationNight');
    } else {
        background_color_night.value = "722C80";
    }
    $('input[name="background_notification_night"]').on('change', function() {
        localStorage.setItem('pickerBackgroundNotificationNight', $(this).val());
        updateBadgeColorBackgroundNight($(this).val());
    });
});

// color picker night > font color
$(document).ready(function() {
    var background_color_night = document.getElementById("color_font_notification_night");
    var val = localStorage.getItem("pickerFontNotificationNight");
    if (typeof val !== 'undefined' && val !== null) {
        background_color_night.value = localStorage.getItem('pickerFontNotificationNight');
    } else {
        background_color_night.value = "FFFFFF";
    }
    $('input[name="color_font_notification_night"]').on('change', function() {
        localStorage.setItem('pickerFontNotificationNight', $(this).val());
        updateBadgeColorTextNight($(this).val());
    });
});

// functions to set properties inside preferencesPanel (to improve)
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
    // removes the C or F in the badge text notification
    browser.browserAction.setBadgeText({
        text: updateNotification.toString().replace("C", "").replace("F", "")
    });
}

function showNotificationWeatherDegrees() {
    var updateNotification;
    if (localStorage.getItem("temperatureRadio") == "F") {
        updateNotification = parseInt((localStorage.getItem("temperature").toString().replace("°F", "").replace("°C", "") * 9) / 5 + 32);
    } else {
        updateNotification = parseInt(localStorage.getItem("temperature").toString().replace("°F", "").replace("°C", ""));
    }
    // removes the C or F in the badge text notification
    browser.browserAction.setBadgeText({
        text: updateNotification.toString() + "°"
    });
}

function updateBadgeColorBackgroundDay(val) {
    // set background notification color day
    if (localStorage.getItem("pickerBackgroundNotificationDay") == null) {
        browser.browserAction.setBadgeBackgroundColor({
            color: "#5387E8"
        });
    } else {
        if (localStorage.getItem("imageWeather").includes("d.png")) {
            browser.browserAction.setBadgeBackgroundColor({
                color: "#" + val
            });
        }
    }
}

function updateBadgeColorTextDay(val) {
    // set text color font day
    if (localStorage.getItem("pickerFontNotificationDay") == null) {
        browser.browserAction.setBadgeTextColor({
            color: "#FFFFFF"
        });
    } else {
        if (localStorage.getItem("imageWeather").includes("d.png")) {
            browser.browserAction.setBadgeTextColor({
                color: "#" + val
            });
        }
    }
}

function updateBadgeColorBackgroundNight(val) {
    // set background notification color night
    if (localStorage.getItem("pickerBackgroundNotificationNight") == null) {
        browser.browserAction.setBadgeBackgroundColor({
            color: "#722C80"
        });
    } else {
        if (localStorage.getItem("imageWeather").includes("n.png")) {
            browser.browserAction.setBadgeBackgroundColor({
                color: "#" + val
            });
        }
    }
}

function updateBadgeColorTextNight(val) {
    // set text color font night
    if (localStorage.getItem("pickerFontNotificationNight") == null) {
        browser.browserAction.setBadgeTextColor({
            color: "#FFFFFF"
        });
    } else {
        if (localStorage.getItem("imageWeather").includes("n.png")) {
            browser.browserAction.setBadgeTextColor({
                color: "#" + val
            });
        }
    }
}