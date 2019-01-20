// changelog menu
var changelogMenu = document.getElementById("changelogMenu");
var changelogPanel = document.getElementById("changelogPanel");
var upArrow = document.getElementById("upArrow");
var mainPanel = document.getElementById("mainPanel");

changelogMenu.addEventListener('click', function(){
  if (changelogPanel.style.display === 'none'){
    changelogPanel.style.display = 'inline';
    mainPanel.style.display = 'inline';
    upArrow.style.display = 'inline';
    changelogMenu.style.display = 'none';
  }else{
    changelogPanel.style.display = 'none';
  }
}, false);

changelogPanel.addEventListener('click', function(){
  if (changelogPanel.style.display === 'inline'){
    changelogPanel.style.display = 'inline';
    upArrow.style.display = 'inline';
    changelogMenu.style.display = 'none';

  }else{
    changelogPanel.style.display = 'none';
    upArrow.style.display = 'none';
    changelogMenu.style.display = 'none';
  }
}, false);

upArrow.addEventListener('click', function(){
  if (changelogPanel.style.display === 'none'){
    changelogPanel.style.display = 'none';
    mainPanel.style.display = 'none';
    upArrow.style.display = 'none';
  }else{
    changelogPanel.style.display = 'none';
    upArrow.style.display = 'none';
    changelogMenu.style.display = 'inline';
  }
}, false);