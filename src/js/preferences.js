// temperature radio
var backgroundPage = browser.extension.getBackgroundPage();

// version
var version = document.getElementById("version");
version.textContent = browser.runtime.getManifest().name + " (v"+ browser.runtime.getManifest().version + ")";

$(document).ready(function(){
  var radios = document.getElementsByName("temperature");
  var val = localStorage.getItem('temperatureRadio');
  for(var i=0;i<radios.length;i++){
    if(radios[i].value == val){
      radios[i].checked = true;
    }
  }
$('input[name="temperature"]').on('change', function(){
    localStorage.setItem('temperatureRadio', $(this).val());
    backgroundPage.request.onload();
  });
});


// speed radio
$(document).ready(function(){
  var radios = document.getElementsByName("speed");
  var val = localStorage.getItem('speedRadio');
  for(var i=0;i<radios.length;i++){
    if(radios[i].value == val){
      radios[i].checked = true;
    }
  }
$('input[name="speed"]').on('change', function(){
    localStorage.setItem('speedRadio', $(this).val());
    backgroundPage.request.onload();
   });
});

// context menu
$(document).ready(function(){
  var radios = document.getElementsByName("contextMenu");
  var val = localStorage.getItem('contextMenu');
  for(var i=0;i<radios.length;i++){
    if(radios[i].value == val){
      radios[i].checked = true;
    }
  }
$('input[name="contextMenu"]').on('change', function(){
    localStorage.setItem('contextMenu', $(this).val());
    backgroundPage.contextMenuFunction();
  });
});

// color picker day > background color
$(document).ready(function(){
  var background_color_day = document.getElementById("background_notification_day");
  var val = localStorage.getItem("pickerBackgroundNotificationDay");
  if (typeof val !== 'undefined' && val !== null){
    background_color_day.value = localStorage.getItem('pickerBackgroundNotificationDay');
  }else{
    background_color_day.value = "5387E8";
  }
  $('input[name="background_notification_day"]').on('change', function(){
    localStorage.setItem('pickerBackgroundNotificationDay', $(this).val());
    backgroundPage.request.onload();
  });
 });

// color picker day > font color
$(document).ready(function(){
  var background_color_day = document.getElementById("color_font_notification_day");
  var val = localStorage.getItem("pickerFontNotificationDay");
  if (typeof val !== 'undefined' && val !== null){
    background_color_day.value = localStorage.getItem('pickerFontNotificationDay');
  }else{
    background_color_day.value = "FFFFFF";
  }
  $('input[name="color_font_notification_day"]').on('change', function(){
    localStorage.setItem('pickerFontNotificationDay', $(this).val());
    backgroundPage.request.onload();
  });
 });

// color picker night > background color
$(document).ready(function(){
  var background_color_night = document.getElementById("background_notification_night");
  var val = localStorage.getItem("pickerBackgroundNotificationNight");
  if (typeof val !== 'undefined' && val !== null){
    background_color_night.value = localStorage.getItem('pickerBackgroundNotificationNight');
  }else{
    background_color_night.value = "722C80";
  }
  $('input[name="background_notification_night"]').on('change', function(){
    localStorage.setItem('pickerBackgroundNotificationNight', $(this).val());
    backgroundPage.request.onload();
  });
 });

// color picker night > font color
$(document).ready(function(){
  var background_color_night = document.getElementById("color_font_notification_night");
  var val = localStorage.getItem("pickerFontNotificationNight");
  if (typeof val !== 'undefined' && val !== null){
    background_color_night.value = localStorage.getItem('pickerFontNotificationNight');
  }else{
    background_color_night.value = "FFFFFF";
  }
  $('input[name="color_font_notification_night"]').on('change', function(){
    localStorage.setItem('pickerFontNotificationNight', $(this).val());
    backgroundPage.request.onload();
  });
 });