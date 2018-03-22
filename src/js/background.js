var myStorage = window.localStorage;
// geolocation
var optionsAccuracy = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
navigator.geolocation.getCurrentPosition(callback, error, optionsAccuracy);
function callback(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  requestAPI = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&units=metric&type=accurate&appid=f6ad51f2a88b64f68794bbb7d5665c71';
  request.open('GET', requestAPI, true);
  request.responseType = 'json';
  request.send();
}
function error(){
  console.log("Error API!");
}
var requestAPI = "";
var request = new XMLHttpRequest();

// notifications update
var updateNotification;

// getting elements by id
var city = document.getElementById('city');
var imageWeather = document.getElementById('imageWeather');
var description = document.getElementById('description');
var temperature = document.getElementById('temperature');
var humidity = document.getElementById('humidity');
var wind = document.getElementById('wind');
var gust = document.getElementById('gust');
var tempMin = document.getElementById('temperatureMin');
var tempMax = document.getElementById('temperatureMax');

// getting preferences elements by id
var preferences = document.getElementById('preferences');
var preferencesPanel = document.getElementById('preferencesPanel');
var mainPanel = document.getElementById('mainPanel');
var outPreferences = document.getElementById('outPreferences');
var checkTemperature = document.getElementById('checkboxTemperature');
var save = document.getElementById('save');
var resultSuccess = document.getElementById('resultSuccess');

if ((checkTemperature.checked == true) || (checkTemperature.checked == 'true')){
  myStorage.setItem("temperatureChecked", true);
  checkTemperature.checked = true; 
}else {
  myStorage.setItem("temperatureChecked", false);
  checkTemperature.checked = false;
}

// preferences 
preferences.addEventListener('click', function(){
  if (preferencesPanel.style.display === 'none'){
    preferencesPanel.style.display = 'inline';
    mainPanel.style.display = 'none';
  }else{
    preferencesPanel.style.display = 'none';
  }
}, false);

outPreferences.addEventListener('click', function(){
  if (preferencesPanel.style.display === 'inline'){
    preferencesPanel.style.display = 'none';
    mainPanel.style.display = 'inline';
    resultSuccess.style.display = 'none';
  }else{
    preferencesPanel.style.display = 'none';
  }
}, false);

save.addEventListener('click', function(){
  resultSuccess.style.display = 'inline';
  setTimeout(function() {
    resultSuccess.style.display = 'none';
  }, 1200);

  if (checkTemperature.checked == true){
    myStorage.setItem("temperatureChecked", true);
    checkTemperature.checked = true;
  }else if (checkTemperature.checked == false){
    myStorage.setItem("temperatureChecked", false);
    checkTemperature.checked = false;
  }else {
    myStorage.setItem("temperatureChecked", true);
    checkTemperature.checked = true;
  }

}, false);

// saved values
var savedImageWeather = myStorage.getItem("imageWeather");
var savedDescriptionResult = myStorage.getItem("description");
var savedCityResult = myStorage.getItem("city");
var savedTemperatureResult = myStorage.getItem("temperature");
var savedHumidityResult = myStorage.getItem("humidity");
var savedWindResult = myStorage.getItem("wind");
var savedGustResult = myStorage.getItem("gust");
var savedTemperatureMin = myStorage.getItem("temperatureMin");
var savedTemperatureMax = myStorage.getItem("temperatureMax");

// recover values
imageWeather.src = savedImageWeather;
description.innerHTML = savedDescriptionResult;
city.innerHTML = savedCityResult;
temperature.innerHTML = savedTemperatureResult;
temperatureMin.innerHTML = savedTemperatureMin;
temperatureMax.innerHTML = savedTemperatureMax;
humidity.innerHTML = savedHumidityResult;
wind.innerHTML = savedWindResult;
gust.innerHTML = savedGustResult;

//get hour
var d = new Date();
var actualHour = d.getHours();

//color of separator in popup
if ((actualHour > 7)&&(actualHour < 19)){
  document.getElementById('separator1').style.background = "#E1EBF2";
  document.getElementById('separator2').style.background = "#E1EBF2";
  document.getElementById('separator3').style.background = "#E1EBF2";
  document.getElementById('separator4').style.background = "#E1EBF2";
}else {
  document.getElementById('separator1').style.background = "#DCD5F2";
  document.getElementById('separator2').style.background = "#DCD5F2";
  document.getElementById('separator3').style.background = "#DCD5F2";
  document.getElementById('separator4').style.background = "#DCD5F2";
}

request.onload = function() {
  checkTemperature.checked = myStorage.getItem("temperatureChecked");
  var toolbarWeather = request.response;
  city.innerHTML = toolbarWeather.name;
  humidity.innerHTML = toolbarWeather.main.humidity + " %";
  wind.innerHTML = parseInt(toolbarWeather.wind.speed * 3.6) + " km/h";
  imageWeather.src = "../res/icons/weather_popup/"+toolbarWeather.weather[0].icon+".png";

  if (checkTemperature.checked == "true"){
    updateNotification = parseInt(toolbarWeather.main.temp)+ "°C";
    temperature.innerHTML = parseInt(toolbarWeather.main.temp) + "°C";
    tempMin.innerHTML = toolbarWeather.main.temp_min + "°C";
    tempMax.innerHTML = toolbarWeather.main.temp_max + "°C";
    // save
    myStorage.setItem("temperature", parseInt(toolbarWeather.main.temp) + "°C");
    myStorage.setItem("temperatureMin", toolbarWeather.main.temp_min + "°C");
    myStorage.setItem("temperatureMax", toolbarWeather.main.temp_max + "°C");
  }else{
    updateNotification = parseInt((toolbarWeather.main.temp * 9)/5 + 32)+"°F";
    temperature.innerHTML = parseInt((toolbarWeather.main.temp * 9)/5 + 32) + "°F";
    tempMin.innerHTML = ((toolbarWeather.main.temp_min * 9)/5 + 32).toFixed(1)  + "°F";
    tempMax.innerHTML = ((toolbarWeather.main.temp_max * 9)/5 + 32 ).toFixed(1) + "°F";
    // save
    myStorage.setItem("temperature", parseInt((toolbarWeather.main.temp * 9)/5 + 32) + "°F");
    myStorage.setItem("temperatureMin", ((toolbarWeather.main.temp_min * 9)/5 + 32).toFixed(1)  + "°F");
    myStorage.setItem("temperatureMax", ((toolbarWeather.main.temp_max * 9)/5 + 32 ).toFixed(1) + "°F");
  }

  if (toolbarWeather.wind.gust == null){
    gust.innerHTML = "0 km/h";
    var currentGust = "0 km/h";
  }else{
    gust.innerHTML = parseInt(toolbarWeather.wind.gust * 3.6) + " km/h";
    var currentGust = parseInt(toolbarWeather.wind.gust * 3.6) + " km/h";
  }
  browser.browserAction.setIcon({path: "../res/icons/weather/"+toolbarWeather.weather[0].icon+".png"});

  if (toolbarWeather.weather[0].id == 800){
    description.innerHTML = browser.i18n.getMessage("clearSky");
    var currentDescription = browser.i18n.getMessage("clearSky");
  }
  else if (toolbarWeather.weather[0].id == 801){
    description.innerHTML = browser.i18n.getMessage("fewClouds");
    var currentDescription = browser.i18n.getMessage("fewClouds");
  }
  else if (toolbarWeather.weather[0].id == 802) {
    description.innerHTML = browser.i18n.getMessage("scatteredClouds");
    var currentDescription = browser.i18n.getMessage("scatteredClouds");
  }
  else if ((toolbarWeather.weather[0].id >= 803) && (toolbarWeather.weather[0].id <= 804)) {
    description.innerHTML = browser.i18n.getMessage("brokenClouds");
    var currentDescription = browser.i18n.getMessage("brokenClouds");
  }
  else if  ((toolbarWeather.weather[0].id >= 300) &&  (toolbarWeather.weather[0].id <= 321)) {
    description.innerHTML = browser.i18n.getMessage("showerRain");
    var currentDescription = browser.i18n.getMessage("showerRain");
  }
  else if ((toolbarWeather.weather[0].id >= 600) &&  (toolbarWeather.weather[0].id <= 622)) {
    description.innerHTML = browser.i18n.getMessage("snow");
    var currentDescription = browser.i18n.getMessage("snow");
  }
  else if ((toolbarWeather.weather[0].id >= 701) && (toolbarWeather.weather[0].id <= 781)) {
    description.innerHTML = browser.i18n.getMessage("mist");
    var currentDescription = browser.i18n.getMessage("mist");
  }
  else if ((toolbarWeather.weather[0].id >= 200) && (toolbarWeather.weather[0].id <= 232)) {
    description.innerHTML = browser.i18n.getMessage("thunderstorm");
  }
  else if ((toolbarWeather.weather[0].id >= 500) &&  (toolbarWeather.weather[0].id <= 504)) {
    description.innerHTML = browser.i18n.getMessage("rain");
    var currentDescription = browser.i18n.getMessage("rain");
  }

  // save last update on weather
  myStorage.setItem("imageWeather", "../res/icons/weather_popup/"+toolbarWeather.weather[0].icon+".png");
  myStorage.setItem("description", currentDescription);
  myStorage.setItem("city", toolbarWeather.name);
  myStorage.setItem("humidity", toolbarWeather.main.humidity + " %");
  myStorage.setItem("wind", parseInt(toolbarWeather.wind.speed * 3.6) + " km/h");
  myStorage.setItem("gust", currentGust);

  browser.browserAction.setBadgeText({text: updateNotification.toString()});
  if ((actualHour > 7)&&(actualHour < 19)){
     browser.browserAction.setBadgeBackgroundColor({'color': '#5387E8'});
  } else {
    browser.browserAction.setBadgeBackgroundColor({'color': '#722C80'});
  }
}