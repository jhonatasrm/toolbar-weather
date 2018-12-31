var api = '';
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
  requestAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&units=metric&type=accurate&appid='+api;
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

var dayTomorrow = document.getElementById('tomorrow');
var dayAfterTomorrow = document.getElementById('afterTomorrow');
var tempMinTomorrow = document.getElementById('tempMinTomorrow');
var tempMinAfterTomorrow = document.getElementById('tempMinAfterTomorrow');
var tempMaxTomorrow = document.getElementById('tempMaxTomorrow');
var tempMaxAfterTomorrow = document.getElementById('tempMaxAfterTomorrow');
var weatherTomorrow = document.getElementById('weatherTomorrow');
var weatherAfterTomorrow = document.getElementById('weatherAfterTomorrow');
var imageWeatherTomorrow = document.getElementById('imageWeatherTomorrow');
var imageWeatherAfterTomorrow = document.getElementById('imageWeatherAfterTomorrow');

// getting preferences elements by id
var preferences = document.getElementById('preferences');
var forecast = document.getElementById('forecast');
var preferencesPanel = document.getElementById('preferencesPanel');
var forecastPanel = document.getElementById('forecastPanel');
var mainPanel = document.getElementById('mainPanel');
var upArrow = document.getElementById('upArrow');
var downArrow = document.getElementById('downArrow');
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

// forecast
forecast.addEventListener('click', function(){
  if (forecastPanel.style.display === 'none'){
    forecastPanel.style.display = 'inline';
    mainPanel.style.display = 'inline';
    upArrow.style.display = 'inline';
    forecast.style.display = 'none';
  }else{
    forecastPanel.style.display = 'none';
    downArrow.style.display = 'none';
  }
}, false);

forecastPanel.addEventListener('click', function(){
  if (forecastPanel.style.display === 'inline'){
    forecastPanel.style.display = 'inline';
    upArrow.style.display = 'inline';
    forecast.style.display = 'none';

  }else{
    forecastPanel.style.display = 'none';
    upArrow.style.display = 'none';
    forecast.style.display = 'none';
  }
}, false);

upArrow.addEventListener('click', function(){
  if (forecastPanel.style.display === 'none'){
    forecastPanel.style.display = 'none';
    mainPanel.style.display = 'none';
    downArrow.style.display = 'inline';
    upArrow.style.display = 'none';
  }else{
    forecastPanel.style.display = 'none';
    upArrow.style.display = 'none';
    forecast.style.display = 'inline';
  }
}, false);

// get week day
var weekDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var d = new Date();
var dayTomorrowResult = weekDay[d.getDay()+1];
var dayAfterTomorrowResult = weekDay[d.getDay()+2];

dayTomorrow.innerHTML = browser.i18n.getMessage(dayTomorrowResult); // can change for week day instead 'Tomorrow'
dayAfterTomorrow.innerHTML = browser.i18n.getMessage(dayAfterTomorrowResult);

myStorage.setItem("dayTomorrow", browser.i18n.getMessage(dayTomorrowResult));
myStorage.setItem("dayAfterTomorrow", browser.i18n.getMessage(dayAfterTomorrowResult));

//
//save.addEventListener('click', function(){
//  resultSuccess.style.display = 'inline';
//  setTimeout(function() {
//    resultSuccess.style.display = 'none';
//  }, 1200);
//
//  if (checkTemperature.checked == true){
//    myStorage.setItem("temperatureChecked", true);
//    checkTemperature.checked = true;
//  }else if (checkTemperature.checked == false){
//    myStorage.setItem("temperatureChecked", false);
//    checkTemperature.checked = false;
//  }else {
//    myStorage.setItem("temperatureChecked", true);
//    checkTemperature.checked = true;
//  }
//
//}, false);

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
imageWeather.src = savedImageWeather;
description.innerHTML = savedDescriptionResult;
city.innerHTML = savedCityResult;
temperature.innerHTML = savedTemperatureResult;
temperatureMin.innerHTML = savedTemperatureMin;
temperatureMax.innerHTML = savedTemperatureMax;
humidity.innerHTML = savedHumidityResult;
wind.innerHTML = savedWindResult;
gust.innerHTML = savedGustResult;

weatherTomorrow.innerHTML = savedWeatherTomorrow;
weatherAfterTomorrow.innerHTML = savedWeatherAfterTomorrow;
imageWeatherTomorrow.src = savedImageWeatherTomorrow;
imageWeatherAfterTomorrow.src = savedImageWeatherAfterTomorrow;
tempMinTomorrow.innerHTML = savedTempMinTomorrow;
tempMinAfterTomorrow.innerHTML = savedTempMinAfterTomorrow;
tempMaxTomorrow.innerHTML = savedTempMaxTomorrow;
tempMaxAfterTomorrow.innerHTML = savedTempMaxAfterTomorrow;
dayTomorrow.innerHTML = savedDayTomorrow;
dayAfterTomorrow.innerHTML = savedDayAfterTomorrow;

//get hour
var d = new Date();
var actualHour = d.getHours();

//color of separator in popup
if ((actualHour > 7)&&(actualHour < 19)){
  document.getElementById('separator1').style.background = "#E1EBF2";
  document.getElementById('separator2').style.background = "#E1EBF2";
  document.getElementById('separator3').style.background = "#E1EBF2";
  document.getElementById('separator4').style.background = "#E1EBF2";
  document.getElementById('separator5').style.background = "#F9FBFC";
  document.getElementById('separator6').style.background = "#F9FBFC";
}else {
  document.getElementById('separator1').style.background = "#DCD5F2";
  document.getElementById('separator2').style.background = "#DCD5F2";
  document.getElementById('separator3').style.background = "#DCD5F2";
  document.getElementById('separator4').style.background = "#DCD5F2";
  document.getElementById('separator5').style.background = "#EAE5F7";
  document.getElementById('separator6').style.background = "#EAE5F7";
}

request.onload = function() {
//  checkTemperature.checked = myStorage.getItem("temperatureChecked");
  var toolbarWeather = request.response;
  city.innerHTML = toolbarWeather.city.name;
  humidity.innerHTML = toolbarWeather.list[0].main.humidity + " %";
  wind.innerHTML = parseInt(toolbarWeather.list[0].wind.speed * 3.6) + " km/h";
  imageWeather.src = "../res/icons/weather_popup/"+toolbarWeather.list[0].weather[0].icon+".png";
  imageWeatherTomorrow.src = "../res/icons/weather_popup/"+toolbarWeather.list[8].weather[0].icon+".png";
  imageWeatherAfterTomorrow.src = "../res/icons/weather_popup/"+toolbarWeather.list[16].weather[0].icon+".png";
  tempMinTomorrow.innerHTML = toolbarWeather.list[8].main.temp_min + "°C";
  tempMaxTomorrow.innerHTML = toolbarWeather.list[8].main.temp_max + "°C";
  tempMinAfterTomorrow.innerHTML = toolbarWeather.list[16].main.temp_min + "°C";
  tempMaxAfterTomorrow.innerHTML = toolbarWeather.list[16].main.temp_max + "°C";

//  if (checkTemperature.checked == "true"){
    updateNotification = parseInt(toolbarWeather.list[0].main.temp)+ "°C";
    temperature.innerHTML = parseInt(toolbarWeather.list[0].main.temp) + "°C";
    tempMin.innerHTML = toolbarWeather.list[0].main.temp_min + "°C";
    tempMax.innerHTML = toolbarWeather.list[0].main.temp_max + "°C";
//    tempMinTomorrow.innerHTML = toolbarWeather.main.temp_min + "°C";       // min tomorrow C
//    tempMinAfterTomorrow.innerHTML = toolbarWeather.main.temp_min + "°C";  // min after tomorrow c
//    tempMaxTomorrow.innerHTML = toolbarWeather.main.temp_max + "°C";       // max tomorrow C
//    tempMaxAfterTomorrow.innerHTML = toolbarWeather.main.temp_max + "°C"; // max after tomorrow C
//
    // save
    myStorage.setItem("tempMinTomorrow", toolbarWeather.list[8].main.temp_min + "°C");
    myStorage.setItem("tempMinAfterTomorrow", toolbarWeather.list[16].main.temp_min + "°C");
    myStorage.setItem("tempMaxTomorrow", toolbarWeather.list[8].main.temp_max + "°C");
    myStorage.setItem("tempMaxAfterTomorrow", toolbarWeather.list[16].main.temp_max + "°C");

    myStorage.setItem("temperature", parseInt(toolbarWeather.list[0].main.temp) + "°C");
    myStorage.setItem("temperatureMin", toolbarWeather.list[0].main.temp_min + "°C");
    myStorage.setItem("temperatureMax", toolbarWeather.list[0].main.temp_max + "°C");
//  }else{
//    updateNotification = parseInt((toolbarWeather.main.temp * 9)/5 + 32)+"°F";
//    temperature.innerHTML = parseInt((toolbarWeather.main.temp * 9)/5 + 32) + "°F";
//    tempMin.innerHTML = ((toolbarWeather.main.temp_min * 9)/5 + 32).toFixed(1)  + "°F";
//    tempMax.innerHTML = ((toolbarWeather.main.temp_max * 9)/5 + 32 ).toFixed(1) + "°F";
//    tempMinTomorrow.innerHTML = ((toolbarWeather.main.temp_min * 9)/5 + 32).toFixed(1)  + "°F"; // min tomorrow
//    tempMaxTomorrow.innerHTML = ((toolbarWeather.main.temp_max * 9)/5 + 32).toFixed(1)  + "°F"; // min tomorrow
//    tempMinAfterTomorrow.innerHTML = ((toolbarWeather.main.temp_min * 9)/5 + 32).toFixed(1)  + "°F"; // min tomorrow
//    tempMaxAfterTomorrow.innerHTML = ((toolbarWeather.main.temp_max * 9)/5 + 32).toFixed(1)  + "°F"; // min tomorrow
    // save
//    myStorage.setItem("tempMinTomorrow", ((toolbarWeather.main.temp_min * 9)/5 + 32).toFixed(1)  + "°F"); // min tomorrow
//    myStorage.setItem("tempMinAfterTomorrow", ((toolbarWeather.main.temp_min * 9)/5 + 32).toFixed(1)  + "°F"); // min tomorrow
//    myStorage.setItem("tempMaxTomorrow", ((toolbarWeather.main.temp_max * 9)/5 + 32).toFixed(1)  + "°F"); // min tomorrow
//    myStorage.setItem("tempMaxAfterTomorrow", ((toolbarWeather.main.temp_max * 9)/5 + 32).toFixed(1)  + "°F"); // min tomorrow
//
//    myStorage.setItem("temperature", parseInt((toolbarWeather.main.temp * 9)/5 + 32) + "°F");
//    myStorage.setItem("temperatureMin", ((toolbarWeather.main.temp_min * 9)/5 + 32).toFixed(1)  + "°F");
//    myStorage.setItem("temperatureMax", ((toolbarWeather.main.temp_max * 9)/5 + 32 ).toFixed(1) + "°F");
//  }

  if (toolbarWeather.list[0].wind.speed == null){
    gust.innerHTML = "0 km/h";
    var currentGust = "0 km/h";
  }else{
    gust.innerHTML = parseInt(toolbarWeather.list[0].wind.speed * 3.6) + " km/h";
    var currentGust = parseInt(toolbarWeather.list[0].wind.speed * 3.6) + " km/h";
  }

  browser.browserAction.setIcon({path: "../res/icons/weather/"+toolbarWeather.list[0].weather[0].icon+".png"});

  if (toolbarWeather.list[0].weather[0].id == 800){
    description.innerHTML = browser.i18n.getMessage("clearSky");
    var currentDescription = browser.i18n.getMessage("clearSky");
  }
  else if (toolbarWeather.list[0].weather[0].id == 801){
    description.innerHTML = browser.i18n.getMessage("fewClouds");
    var currentDescription = browser.i18n.getMessage("fewClouds");
  }
  else if (toolbarWeather.list[0].weather[0].id == 802) {
    description.innerHTML = browser.i18n.getMessage("scatteredClouds");
    var currentDescription = browser.i18n.getMessage("scatteredClouds");
  }
  else if ((toolbarWeather.list[0].weather[0].id >= 803) && (toolbarWeather.list[0].weather[0].id <= 804)) {
    description.innerHTML = browser.i18n.getMessage("brokenClouds");
    var currentDescription = browser.i18n.getMessage("brokenClouds");
  }
  else if  ((toolbarWeather.list[0].weather[0].id >= 300) &&  (toolbarWeather.list[0].weather[0].id <= 321)) {
    description.innerHTML = browser.i18n.getMessage("showerRain");
    var currentDescription = browser.i18n.getMessage("showerRain");
  }
  else if ((toolbarWeather.list[0].weather[0].id >= 600) &&  (toolbarWeather.list[0].weather[0].id <= 622)) {
    description.innerHTML = browser.i18n.getMessage("snow");
    var currentDescription = browser.i18n.getMessage("snow");
  }
  else if ((toolbarWeather.list[0].weather[0].id >= 701) && (toolbarWeather.list[0].weather[0].id <= 781)) {
    description.innerHTML = browser.i18n.getMessage("mist");
    var currentDescription = browser.i18n.getMessage("mist");
  }
  else if ((toolbarWeather.list[0].weather[0].id >= 200) && (toolbarWeather.list[0].weather[0].id <= 232)) {
    description.innerHTML = browser.i18n.getMessage("thunderstorm");
  }
  else if ((toolbarWeather.list[0].weather[0].id >= 500) &&  (toolbarWeather.list[0].weather[0].id <= 504)) {
    description.innerHTML = browser.i18n.getMessage("rain");
    var currentDescription = browser.i18n.getMessage("rain");
  }

  // tomorrow weather
  if (toolbarWeather.list[8].weather[0].id == 800){
    weatherTomorrow.innerHTML = browser.i18n.getMessage("clearSky");
    var currentWeatherTomorrow = browser.i18n.getMessage("clearSky");
  }
  else if (toolbarWeather.list[8].weather[0].id == 801){
    weatherTomorrow.innerHTML = browser.i18n.getMessage("fewClouds");
    var currentWeatherTomorrow = browser.i18n.getMessage("fewClouds");
  }
  else if (toolbarWeather.list[8].weather[0].id == 802) {
    weatherTomorrow.innerHTML = browser.i18n.getMessage("scatteredClouds");
    var currentWeatherTomorrow = browser.i18n.getMessage("scatteredClouds");
  }
  else if ((toolbarWeather.list[8].weather[0].id >= 803) && (toolbarWeather.list[8].weather[0].id <= 804)) {
    weatherTomorrow.innerHTML = browser.i18n.getMessage("brokenClouds");
    var currentWeatherTomorrow = browser.i18n.getMessage("brokenClouds");
  }
  else if  ((toolbarWeather.list[8].weather[0].id >= 300) &&  (toolbarWeather.list[8].weather[0].id <= 321)) {
    weatherTomorrow.innerHTML = browser.i18n.getMessage("showerRain");
    var currentWeatherTomorrow = browser.i18n.getMessage("showerRain");
  }
  else if ((toolbarWeather.list[8].weather[0].id >= 600) &&  (toolbarWeather.list[8].weather[0].id <= 622)) {
    weatherTomorrow.innerHTML = browser.i18n.getMessage("snow");
    var currentWeatherTomorrow = browser.i18n.getMessage("snow");
  }
  else if ((toolbarWeather.list[8].weather[0].id >= 701) && (toolbarWeather.list[8].weather[0].id <= 781)) {
    weatherTomorrow.innerHTML = browser.i18n.getMessage("mist");
    var currentWeatherTomorrow = browser.i18n.getMessage("mist");
  }
  else if ((toolbarWeather.list[8].weather[0].id >= 200) && (toolbarWeather.list[8].weather[0].id <= 232)) {
    weatherTomorrow.innerHTML = browser.i18n.getMessage("thunderstorm");
  }
  else if ((toolbarWeather.list[8].weather[0].id >= 500) &&  (toolbarWeather.list[8].weather[0].id <= 504)) {
    weatherTomorrow.innerHTML = browser.i18n.getMessage("rain");
    var currentWeatherTomorrow = browser.i18n.getMessage("rain");
  }

   // after tomorrow weather
  if (toolbarWeather.list[16].weather[0].id == 800){
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("clearSky");
    var currentWeatherAfterTomorrow = browser.i18n.getMessage("clearSky");
  }
  else if (toolbarWeather.list[16].weather[0].id == 801){
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("fewClouds");
    var currentWeatherAfterTomorrow = browser.i18n.getMessage("fewClouds");
  }
  else if (toolbarWeather.list[16].weather[0].id == 802) {
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("scatteredClouds");
    var currentWeatherAfterTomorrow = browser.i18n.getMessage("scatteredClouds");
  }
  else if ((toolbarWeather.list[16].weather[0].id >= 803) && (toolbarWeather.list[16].weather[0].id <= 804)) {
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("brokenClouds");
    var currentWeatherAfterTomorrow = browser.i18n.getMessage("brokenClouds");
  }
  else if  ((toolbarWeather.list[16].weather[0].id >= 300) &&  (toolbarWeather.list[16].weather[0].id <= 321)) {
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("showerRain");
    var currentWeatherAfterTomorrow = browser.i18n.getMessage("showerRain");
  }
  else if ((toolbarWeather.list[16].weather[0].id >= 600) &&  (toolbarWeather.list[16].weather[0].id <= 622)) {
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("snow");
    var currentWeatherAfterTomorrow = browser.i18n.getMessage("snow");
  }
  else if ((toolbarWeather.list[16].weather[0].id >= 701) && (toolbarWeather.list[16].weather[0].id <= 781)) {
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("mist");
    var currentWeatherAfterTomorrow = browser.i18n.getMessage("mist");
  }
  else if ((toolbarWeather.list[16].weather[0].id >= 200) && (toolbarWeather.list[16].weather[0].id <= 232)) {
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("thunderstorm");
  }
  else if ((toolbarWeather.list[16].weather[0].id >= 500) &&  (toolbarWeather.list[16].weather[0].id <= 504)) {
    weatherAfterTomorrow.innerHTML = browser.i18n.getMessage("rain");
    var currentWeatherAfterTomorrow = browser.i18n.getMessage("rain");
  }

  // save last update on weather
  myStorage.setItem("imageWeather", "../res/icons/weather_popup/"+toolbarWeather.list[0].weather[0].icon+".png");
  myStorage.setItem("imageWeatherTomorrow", "../res/icons/weather_popup/"+toolbarWeather.list[8].weather[0].icon+".png" );
  myStorage.setItem("imageWeatherAfterTomorrow", "../res/icons/weather_popup/"+toolbarWeather.list[16].weather[0].icon+".png" );
  myStorage.setItem("description", currentDescription);
  myStorage.setItem("weatherTomorrow", currentWeatherTomorrow);
  myStorage.setItem("weatherAfterTomorrow", currentWeatherAfterTomorrow);
  myStorage.setItem("city", toolbarWeather.city.name);
  myStorage.setItem("humidity", toolbarWeather.list[0].main.humidity + " %");
  myStorage.setItem("wind", parseInt(toolbarWeather.list[0].wind.speed * 3.6) + " km/h");
  myStorage.setItem("gust", currentGust);

  browser.browserAction.setBadgeText({text: updateNotification.toString()});

  if ((actualHour > 7)&&(actualHour < 19)){
     browser.browserAction.setBadgeBackgroundColor({'color': '#5387E8'});
  } else {
    browser.browserAction.setBadgeBackgroundColor({'color': '#722C80'});
  }
}