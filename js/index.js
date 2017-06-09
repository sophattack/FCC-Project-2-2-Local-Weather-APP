var x = document.getElementById("demo"); 

function onSuccess(position){
  var latitude = position.cord.latitude;
  var longitude = position.cord.longitude;
  return [latitude, longitude];
}


function onError(position){
  if(err.code == 1) {
    alert("Error: Access is denied!");
  }
  else if( err.code == 2) {
    alert("Error: Position is unavailable!");
  }
}

function getLocation(){
  var options={
    enableHighAccuracy:true,
    maximumAge:1000
  }
   
  if(navigator.geolocation){
     navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }  
  else{
    x.innerHTML="This browser does not support getting user location."; 
  }
}
var weather = new XMLHttpRequest();
weather.op
function findYourWeather(latitude, longitude){
  var req = "https://api.darksky.net/forecast/"
  req+="201123e93cda0635a8d23b1bc16947be";
  req+="/"+latitude+","+longitude;
  req+="/exclude=[minutely,hourly,daily,alerts,flags]";
  req+="/units=[ca]"
  $.
  })
}
