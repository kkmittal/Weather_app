const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "18355d78861b5510c51ce0f1118e7f27";
// '7e311f606b4c7f61d242a58030690489'
// https://api.openweathermap.org/data/2.5/weather?lat=22.22&lon=33.33&appid=7e311f606b4c7f61d242a58030690489
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
}
function showWeatherData(data) {
  const humidity = data.main.humidity;
  const temperature = data.main.temp;
  const weatherDescription = data.weather[0].description;
  console.log(data);
  timezone.innerHTML = `${data.name} / ${data.sys.country}`;
  countryEl.innerHTML = data.coord.lat + "N " + data.coord.lon + "E";

  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Temperature</div>
        <div>${temperature}° C</div>
    </div>
    <div class="weather-item">
        <div>Description</div>
        <div>${weatherDescription}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${data.main.pressure}</div>
    </div>
    <div class="weather-item">
        <div>City</div>
        <div>${data.name}</div>
    </div>
    `;
  forecast();
    function forecast() {
    navigator.geolocation.getCurrentPosition((success) => {
      let { latitude, longitude } = success.coords;
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((newdata) => {
          futureForecast(newdata);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
  }

  function futureForecast(data) {
    console.log(data.list[0].main.temp_min);
    const night = document.getElementById('night_temp');
    const day_temp = document.getElementById('day_temp');
    const curr_day = document.getElementById('curr_day');

    
    // Display the first day's night temperature
    night.innerHTML = `<p>Night - ${(data.list[0].main.temp_min - 273).toFixed(2)}</p>`;
    day_temp.innerHTML = `<p>Day - ${(data.list[0].main.temp_max - 273).toFixed(2)}</p>`;
    curr_day.innerHTML = `<p>${days[new Date(data.list[0].dt * 1000).getDay()]}</p>`

    console.log("data", data);
    // Display the forecast data for the next 7 days
    for(let i = 1; i< data.list.length; i+=8){
      const forecastItem = document.createElement('div');
        forecastItem.classList.add('weather-forecast-item');
        
        // Get the day name directly from the API response
        console.log(new Date(data.list[i].dt));
        const dayName = days[new Date(data.list[i].dt * 1000).getDay()];

        const weatherIconURL = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;

        forecastItem.innerHTML = `
            <div class="day">${dayName}</div>
            <img src="${weatherIconURL}" alt="weather icon" class="w-icon">
            <div class="temp">Night - ${(data.list[i].main.temp_min - 273).toFixed(2)}&#176; C</div>
            <div class="temp">Day - ${(data.list[i].main.temp_max - 273).toFixed(2)}&#176; C</div>
        `;

        weatherForecastEl.appendChild(forecastItem);
    }
}




}
