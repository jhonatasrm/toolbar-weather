// temperature radio
var backgroundPage = browser.extension.getBackgroundPage();

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