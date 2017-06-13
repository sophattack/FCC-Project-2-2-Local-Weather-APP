(function () {
    'use strict';
    var displayCity = document.getElementById("city");                  
    var displayCountry = document.getElementById("country");
    var displayTemperature = document.getElementById("temperature");
    var displayDegreeSymbol = document.getElementById("degreeSymbol");
    var displayHumidity = document.getElementById("humidity");
    var displayConditions = document.getElementById("conditions");
    var displayWinds = document.getElementById("winds");
    var displayPressure = document.getElementById("pressure");
    var displaySunrise = document.getElementById("sunrise");
    var displaySunset = document.getElementById("sunset");
    var button = document.getElementById("unit");
    var cityName = "";
    var regionName = "";
    var countryName = "";
    var locationString = "";
    var latitude = "";
    var longitude = "";
    var countryUnits = "metric";                 
    var temperature = "";
    var windSpeed = "";
    var windDirection = "";
    var humidity = "";
    var pressure = "";
    var pressureSymbol = "kPa";                 
    var sunrise = "";
    var sunset = "";
    var currentWeather = "";
    var tempSymbol = "C";                       
    var windSymbol = 'km/h';                     
    var iconURL = "";

    function locationByIP() {
      var locationRequest = new XMLHttpRequest();
      locationRequest.onreadystatechange = function () {
        if (locationRequest.readyState === 4 && locationRequest.status === 200) { 
          var locationObj = JSON.parse(locationRequest.responseText);            
          cityName = locationObj.city;                            
          regionName = locationObj.region;
          countryName = locationObj.country;
          locationString = locationObj.loc.split(',');           
          latitude = Number(locationString[0]);
          longitude = Number(locationString[1]);
          setCountryUnits();                                      
          getWeatherData();                                       
        }
      };
      locationRequest.open("GET", 'https://ipinfo.io/json', true);  
      locationRequest.send();                                         
    }

    function setCountryUnits() {
        if (countryName === 'US' || countryName === 'LY') {            
            countryUnits = 'imperial';
        }
    }

   
    function getWeatherData() {
        var url = 'https://cors.5apps.com/?uri=http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=608f2325a0ac32149fd498a3ebf24641' + '&units=' + countryUnits + '&preventCache=' + new Date(); 
        var weatherRequest = new XMLHttpRequest();
        weatherRequest.onreadystatechange = function () {
            if (weatherRequest.readyState === 4 && weatherRequest.status === 200) {
                var obj = JSON.parse(weatherRequest.responseText);
                processResponse(obj);               
            }
        };
        weatherRequest.open("GET", url, true);                          
        weatherRequest.send();                                          
    }

    function processResponse(obj) {
        temperature = Math.round(obj.main.temp);
        if (countryUnits === 'metric') {                                
            windSpeed = Math.round(obj.wind.speed * 18 / 5);           
            pressure = Math.round(obj.main.pressure) / 10;              
        }
        else {
            windSpeed = Math.round(obj.wind.speed);
            pressure = Math.round(obj.main.pressure);
        }
        windDirection = degreeToCardinal(obj.wind.deg);      
        currentWeather = obj.weather[0].description;
        humidity = obj.main.humidity;
        var sunriseDateObj = unixTimeToLocal(obj.sys.sunrise);          
        sunrise = sunriseDateObj.toLocaleTimeString();
        var sunsetDateObj = unixTimeToLocal(obj.sys.sunset);            
        sunset = sunsetDateObj.toLocaleTimeString();
        iconURL = 'https://cors.5apps.com/?uri=http://openweathermap.org/img/w/' + obj.weather[0].icon + '.png';
        displayRefresh();
    }

   
    function displayRefresh() {
        displayCity.innerHTML = cityName;
        displayCountry.innerHTML = regionName + ", " + countryName;
        displayTemperature.innerHTML = temperature;
        displayDegreeSymbol.innerHTML = " &deg;" + tempSymbol;
        displayConditions.innerHTML = currentWeather;
        displayWinds.innerHTML = "Winds " + windDirection + " " + windSpeed + " " + windSymbol;
        displayPressure.innerHTML = "Barometric Pressure: " + pressure + " " + pressureSymbol;
        displayHumidity.innerHTML = "Humidity: " + humidity + "%";
        displaySunrise.innerHTML = "Sunrise at " + sunrise;
        displaySunset.innerHTML = "Sunset at " + sunset;
        var newElement = document.createElement('img');
        newElement.src = iconURL;
        newElement.setAttribute("id", "icons");
        document.getElementById("icon").appendChild(newElement);
        var image = backgroundPicture;
        var referenceMainWrapper = document.getElementById("main-wrapper");
        referenceMainWrapper.style.backgroundImage = 'url(' + image + ')';
        referenceMainWrapper.style.backgroundSize = "100% auto";
    }

    function metricToImperial() {
        if (countryUnits === 'metric') {                          
            tempSymbol = 'F';
            windSymbol = 'miles/hour';
            countryUnits = 'imperial';
            pressureSymbol = 'mb';
           
            temperature = Math.round((temperature * 9 / 5) + 32);       
            displayTemperature.innerHTML = temperature;
            displayDegreeSymbol.innerHTML = " &deg;" + tempSymbol;
            windSpeed = Math.round(windSpeed / 1.609344);              
            displayWinds.innerHTML = "Winds " + windDirection + " " + windSpeed + " " + windSymbol;
            pressure = pressure * 10;                                
            displayPressure.innerHTML = "Barometric Pressure: " + pressure + " " + pressureSymbol;
        }
    }
  function imperialToMetric() {
        if(countryUnits==="imperial") {
            tempSymbol = 'C';
            countryUnits = 'metric';
            windSymbol = 'km/hour';
            pressureSymbol = 'kPa';
            
            temperature = Math.round((temperature - 32) * 5 / 9);
            displayTemperature.innerHTML = temperature;
            displayDegreeSymbol.innerHTML = " &deg;" + tempSymbol;
            windSpeed = Math.round(windSpeed * 1.609344);
            displayWinds.innerHTML = "Winds " + windDirection + " " + windSpeed + " " + windSymbol;
            pressure = pressure / 10;
            displayPressure.innerHTML = "Barometric Pressure: " + pressure + " " + pressureSymbol;
        }
    }

    function unixTimeToLocal(unix) {
        var local = new Date(0);
        local.setUTCSeconds(unix);
        return local;
    }

  
    function degreeToCardinal(degree) {
        if (degree > 337.5 && degree < 22.5) {
            return "N";
        } else if (degree > 22.5 && degree < 67.5) {
            return "NE";
        } else if (degree > 67.5 && degree < 112.5) {
            return "E";
        } else if (degree > 112.5 && degree < 157.5) {
            return "SE";
        } else if (degree > 157.5 && degree < 202.5) {
            return "S";
        } else if (degree > 202.5 && degree < 247.5) {
            return "SW";
        } else if (degree > 247.5 && degree < 292.5) {
            return "W";
        } else if (degree > 292.5 && degree < 337.5) {
            return "NW";
        }
    }

    document.getElementById("ctemp").onclick = function () {             
        imperialToMetric(); 
    };
  
  
    document.getElementById("ftemp").onclick = function () {             
        metricToImperial(); 
    };
  
    locationByIP();
})();
