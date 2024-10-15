var unitIsCelcius = true;
var globalForecast = [];

var weatherIconsMap = {
    "1000": "wi-day-sunny",
    "1003": "wi-day-cloudy",
    "1006": "wi-cloudy",
    "1009": "wi-cloud",
    "1030": "wi-fog",
    "1063": "wi-showers",
    "1066": "wi-snow",
    "1069": "wi-sleet",
    "1072": "wi-sleet",
    "1087": "wi-thunderstorm",
    "1114": "wi-snow",
    "1117": "wi-snow",
    "1135": "wi-fog",
    "1147": "wi-fog",
    "1150": "wi-showers",
    "1153": "wi-showers",
    "1168": "wi-sleet",
    "1171": "wi-sleet",
    "1180": "wi-showers",
    "1183": "wi-showers",
    "1186": "wi-showers",
    "1189": "wi-showers",
    "1192": "wi-showers",
    "1195": "wi-showers",
    "1198": "wi-sleet",
    "1201": "wi-sleet",
    "1204": "wi-sleet",
    "1207": "wi-sleet",
    "1210": "wi-snow",
    "1213": "wi-snow",
    "1216": "wi-snow",
    "1219": "wi-snow",
    "1222": "wi-snow",
    "1225": "wi-snow",
    "1237": "wi-hail",
    "1240": "wi-showers",
    "1243": "wi-showers",
    "1246": "wi-showers",
    "1249": "wi-sleet",
    "1252": "wi-sleet",
    "1255": "wi-snow",
    "1258": "wi-snow",
    "1261": "wi-hail",
    "1264": "wi-hail",
    "1273": "wi-thunderstorm",
    "1276": "wi-thunderstorm",
    "1279": "wi-thunderstorm",
    "1282": "wi-thunderstorm"
};

$(function(){
    getWeatherData("Dhaka"); // Default city
    startClock();
    
    $("#search-button").on("click", function() {
        var city = $("#search-input").val();
        if (city) {
            getWeatherData(city);
        }
    });

    $("#search-input").on("keypress", function(e) {
        if (e.which === 13) {
            var city = $(this).val();
            if (city) {
                getWeatherData(city);
            }
        }
    });
});

function startClock(){
    setInterval(function(){
        $("#localTime").text(new Date().toLocaleTimeString());
    }, 1000);
}

function getWeatherData(city){
    var apiKey = 'cf3fb470542f4016a30234621241410';
    $.ajax({
        type: "GET",
        url: `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`,
        cache: false,
        success: function(forecast){
            globalForecast = forecast;
            updateForecast(forecast);

            $("#refreshButton").html("<i class='fa fa-refresh fa-fw'></i> Refresh");
        },
        error: function(error){
            console.log("Error with ajax: "+ error);
        }
    });
}


function updateForecast(forecast){
    var today = forecast.current;
    $("#tempDescription").text(today.condition.text);
    $("#humidity").text(today.humidity);
    $("#wind").text(today.wind_kph);
    $("#localDate").text(getFormattedDate(forecast.location.localtime));
    $("#cityName").text(forecast.location.name);
    $("#cityCode").text(forecast.location.country);
    $("#localTime").text(new Date(forecast.location.localtime).toLocaleTimeString());
    $("#main-icon").attr("class", `wi ${weatherIconsMap[today.condition.code]}`);
    $("#mainTemperature").text(Math.round(today.temp_c));
    $("#mainTempHot").text(Math.round(forecast.forecast.forecastday[0].day.maxtemp_c));
    $("#mainTempLow").text(Math.round(forecast.forecast.forecastday[0].day.mintemp_c));

    for (var i = 1; i <= 4; i++) {
        var day = forecast.forecast.forecastday[i];

        var dayName = getFormattedDate(day.date).substring(0, 3);

        var weatherIcon = weatherIconsMap[day.day.condition.code];

        $(`#forecast-day-${i}-name`).text(dayName);
        $(`#forecast-day-${i}-icon`).attr("class", `wi ${weatherIcon} forecast-icon`);
        $(`#forecast-day-${i}-main`).text(Math.round(day.day.avgtemp_c));
        $(`#forecast-day-${i}-ht`).text(Math.round(day.day.maxtemp_c));
        $(`#forecast-day-${i}-lt`).text(Math.round(day.day.mintemp_c));
    }
}

$("#refreshButton").on("click", function(){
    $("#refreshButton").html("<i class='fa fa-refresh fa-spin fa-fw'></i>");
    getWeatherData($("#cityName").text());
});

$("#celcius").on("click", function(){
    if (!unitIsCelcius) {
        $("#farenheit").removeClass("active");
        this.className = "active";

        var today = globalForecast.current;
        $("#mainTemperature").text(Math.round(today.temp_c));
        $("#mainTempHot").text(Math.round(globalForecast.forecast.forecastday[0].day.maxtemp_c));
        $("#mainTempLow").text(Math.round(globalForecast.forecast.forecastday[0].day.mintemp_c));

        for (var i = 1; i <= 4; i++) {
            var weekDay = globalForecast.forecast.forecastday[i];
            $(`#forecast-day-${i}-main`).text(Math.round(weekDay.day.avgtemp_c));
            $(`#forecast-day-${i}-ht`).text(Math.round(weekDay.day.maxtemp_c));
            $(`#forecast-day-${i}-lt`).text(Math.round(weekDay.day.mintemp_c));
        }

        unitIsCelcius = true;
    }
});

$("#farenheit").on("click", function(){
    if (unitIsCelcius) {
        $("#celcius").removeClass("active");
        this.className = "active";


        var today = globalForecast.current;
        $("#mainTemperature").text(Math.round(today.temp_f));
        $("#mainTempHot").text(Math.round(globalForecast.forecast.forecastday[0].day.maxtemp_f));
        $("#mainTempLow").text(Math.round(globalForecast.forecast.forecastday[0].day.mintemp_f));

        for (var i = 1; i <= 4; i++) {
            var weekDay = globalForecast.forecast.forecastday[i];
            $(`#forecast-day-${i}-main`).text(Math.round(weekDay.day.avgtemp_f));
            $(`#forecast-day-${i}-ht`).text(Math.round(weekDay.day.maxtemp_f));
            $(`#forecast-day-${i}-lt`).text(Math.round(weekDay.day.mintemp_f));
        }

        unitIsCelcius = false;
    }
});

function getFormattedDate(date){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString("en-US", options);
}
