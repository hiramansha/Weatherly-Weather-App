// =========================
// WEATHERLY WEATHER APP
// =========================


// =========================
// DOM ELEMENTS
// =========================

const cityInput =
    document.getElementById("city");

const searchBtn =
    document.getElementById("search-btn");

const errorMessage =
    document.getElementById("error-message");

const cityName =
    document.getElementById("city-name");

const countryName =
    document.getElementById("country-name");

const weatherIcon =
    document.getElementById("weather-icon");

const temperature =
    document.getElementById("temperature");

const condition =
    document.getElementById("condition");

const feelsLike =
    document.getElementById("feels-like");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const visibility =
    document.getElementById("visibility");

const pressure =
    document.getElementById("pressure");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

// IMPORTANT:
// Your HTML uses class="forecast-list"
// not id="hourly-forecast"

const forecastList =
    document.querySelector(".forecast-list");

const dateElement =
    document.getElementById("date");


// =========================
// CHECK HTML ELEMENTS
// =========================

console.log("Weatherly loaded successfully");


// =========================
// DATE
// =========================

function updateDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );
}

updateDate();


// =========================
// WEATHER SCENE CSS
// =========================

const sceneStyle =
    document.createElement("style");

sceneStyle.textContent = `

/* =========================
   BASIC TRANSITION
========================= */

body {
    transition:
        background 0.8s ease,
        color 0.8s ease;
}


/* =========================
   DAY
========================= */

body.weather-day {
    background:
        linear-gradient(
            135deg,
            #e8f4ff,
            #fffdf9
        );
}


/* =========================
   NIGHT
========================= */

body.weather-night {
    background:
        linear-gradient(
            135deg,
            #111c30,
            #263d5c
        );
}


/* =========================
   STARS
========================= */

body.weather-night::before {

    content:
        "✦    ✧    ✦       ✧    ✦";

    position: fixed;

    top: 80px;
    left: 0;

    width: 100%;

    text-align: center;

    color:
        rgba(255,255,255,0.75);

    font-size: 25px;

    letter-spacing: 25px;

    pointer-events: none;

    z-index: 0;

    animation:
        stars 3s ease-in-out
        infinite alternate;
}


@keyframes stars {

    from {
        opacity: 0.3;
    }

    to {
        opacity: 1;
    }
}


/* =========================
   SUMMER
========================= */

body.weather-summer::after {

    content: "☀️";

    position: fixed;

    top: 70px;
    right: 40px;

    font-size: 80px;

    opacity: 0.18;

    pointer-events: none;

    z-index: 0;

    animation:
        sunGlow 3s ease-in-out
        infinite alternate;
}


@keyframes sunGlow {

    from {
        transform: scale(1);
        opacity: 0.12;
    }

    to {
        transform: scale(1.12);
        opacity: 0.25;
    }
}


/* =========================
   RAIN
========================= */

body.weather-rain::before {

    content:
        "│  │   │ │    │   │  │ │   │";

    position: fixed;

    top: -50px;
    left: 0;

    width: 100%;

    color:
        rgba(80,160,210,0.35);

    font-size: 25px;

    line-height: 45px;

    word-spacing: 15px;

    pointer-events: none;

    z-index: 10;

    animation:
        rainFall 1.5s linear
        infinite;
}


@keyframes rainFall {

    from {
        transform:
            translateY(-50px);
    }

    to {
        transform:
            translateY(100vh);
    }
}


/* =========================
   WINTER
========================= */

body.weather-winter::after {

    content:
        "❄   ❄      ❄   ❄       ❄";

    position: fixed;

    top: -50px;
    left: 0;

    width: 100%;

    text-align: center;

    color:
        rgba(255,255,255,0.9);

    font-size: 22px;

    word-spacing: 25px;

    pointer-events: none;

    z-index: 15;

    animation:
        snowFall 7s linear
        infinite;
}


@keyframes snowFall {

    from {
        transform:
            translateY(-50px);
    }

    to {
        transform:
            translateY(100vh);
    }
}


/* =========================
   CONTENT ABOVE EFFECTS
========================= */

.weather-app,
header,
main,
footer {

    position: relative;

    z-index: 20;
}

`;

document.head.appendChild(sceneStyle);


// =========================
// UPDATE WEATHER SCENE
// =========================

function updateScene(
    weatherCode,
    isDay,
    temp
) {

    document.body.classList.remove(
        "weather-day",
        "weather-night",
        "weather-rain",
        "weather-winter",
        "weather-summer"
    );


    // =========================
    // DAY / NIGHT
    // =========================

    if (isDay) {

        document.body.classList.add(
            "weather-day"
        );

    } else {

        document.body.classList.add(
            "weather-night"
        );
    }


    // =========================
    // RAIN
    // =========================

    if (
        weatherCode >= 51 &&
        weatherCode <= 67
    ) {

        document.body.classList.add(
            "weather-rain"
        );
    }


    if (
        weatherCode >= 80 &&
        weatherCode <= 82
    ) {

        document.body.classList.add(
            "weather-rain"
        );
    }


    // =========================
    // SNOW / WINTER
    // =========================

    if (
        weatherCode === 71 ||
        weatherCode === 73 ||
        weatherCode === 75 ||
        weatherCode === 77 ||
        temp <= 10
    ) {

        document.body.classList.add(
            "weather-winter"
        );
    }


    // =========================
    // SUMMER / HOT
    // =========================

    if (
        temp >= 30 &&
        isDay
    ) {

        document.body.classList.add(
            "weather-summer"
        );
    }
}


// =========================
// WEATHER INFORMATION
// =========================

function getWeatherInfo(
    code,
    isDay
) {

    // Clear

    if (code === 0) {

        return {

            condition:
                isDay
                    ? "Clear Sky"
                    : "Clear Night",

            icon:
                isDay
                    ? "☀️"
                    : "🌙"
        };
    }


    // Partly cloudy

    if (
        code === 1 ||
        code === 2
    ) {

        return {

            condition:
                "Partly Cloudy",

            icon:
                "🌤️"
        };
    }


    // Cloudy

    if (code === 3) {

        return {

            condition:
                "Cloudy",

            icon:
                "☁️"
        };
    }


    // Fog

    if (
        code === 45 ||
        code === 48
    ) {

        return {

            condition:
                "Foggy",

            icon:
                "🌫️"
        };
    }


    // Drizzle

    if (
        code === 51 ||
        code === 53 ||
        code === 55 ||
        code === 56 ||
        code === 57
    ) {

        return {

            condition:
                "Drizzle",

            icon:
                "🌦️"
        };
    }


    // Rain

    if (
        code === 61 ||
        code === 63 ||
        code === 65 ||
        code === 66 ||
        code === 67
    ) {

        return {

            condition:
                "Rain",

            icon:
                "🌧️"
        };
    }


    // Snow

    if (
        code === 71 ||
        code === 73 ||
        code === 75 ||
        code === 77
    ) {

        return {

            condition:
                "Snow",

            icon:
                "❄️"
        };
    }


    // Rain showers

    if (
        code === 80 ||
        code === 81 ||
        code === 82
    ) {

        return {

            condition:
                "Rain Showers",

            icon:
                "🌦️"
        };
    }


    // Thunderstorm

    if (
        code === 95 ||
        code === 96 ||
        code === 99
    ) {

        return {

            condition:
                "Thunderstorm",

            icon:
                "⛈️"
        };
    }


    // Default

    return {

        condition:
            "Weather Update",

        icon:
            "🌤️"
    };
}


// =========================
// FIND CITY
// =========================

async function getCityCoordinates(
    city
) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to search for the city."
        );
    }


    const data =
        await response.json();


    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            `City "${city}" was not found.`
        );
    }


    // Exact city match first

    const searchName =
        city.trim().toLowerCase();


    const exactMatch =
        data.results.find(
            result =>
                result.name.toLowerCase() ===
                searchName
        );


    return (
        exactMatch ||
        data.results[0]
    );
}


// =========================
// GET WEATHER
// =========================

async function getWeather(
    city
) {

    try {

        // Loading

        searchBtn.textContent =
            "Loading...";

        searchBtn.disabled =
            true;

        errorMessage.style.display =
            "none";


        // =========================
        // FIND CITY
        // =========================

        const location =
            await getCityCoordinates(
                city
            );


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // =========================
        // WEATHER API
        // =========================

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code,visibility&daily=sunrise,sunset&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;


        const response =
            await fetch(weatherURL);


        if (!response.ok) {

            throw new Error(
                "Weather data could not be loaded."
            );
        }


        const data =
            await response.json();


        // =========================
        // UPDATE SCENE
        // =========================

        updateScene(
            data.current.weather_code,
            data.current.is_day === 1,
            data.current.temperature_2m
        );


        // =========================
        // UPDATE UI
        // =========================

        updateWeather(
            data,
            location
        );

    }


    catch (error) {

        console.error(
            error
        );


        errorMessage.textContent =
            error.message;


        errorMessage.style.display =
            "block";
    }


    finally {

        searchBtn.textContent =
            "Search";

        searchBtn.disabled =
            false;
    }
}


// =========================
// UPDATE CURRENT WEATHER
// =========================

function updateWeather(
    data,
    location
) {

    const current =
        data.current;


    // =========================
    // CITY
    // =========================

    cityName.textContent =
        location.name;


    countryName.textContent =
        location.country;


    // =========================
    // TEMPERATURE
    // =========================

    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    // =========================
    // FEELS LIKE
    // =========================

    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    // =========================
    // CONDITION
    // =========================

    const info =
        getWeatherInfo(
            current.weather_code,
            current.is_day === 1
        );


    condition.textContent =
        info.condition;


    // =========================
    // WEATHER ICON
    // =========================

    weatherIcon.innerHTML =
        info.icon;


    weatherIcon.style.fontSize =
        "75px";


    weatherIcon.style.display =
        "flex";


    weatherIcon.style.alignItems =
        "center";


    weatherIcon.style.justifyContent =
        "center";


    // =========================
    // HUMIDITY
    // =========================

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    // =========================
    // WIND
    // =========================

    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    // =========================
    // PRESSURE
    // =========================

    pressure.textContent =
        `${Math.round(
            current.surface_pressure
        )} hPa`;


    // =========================
    // VISIBILITY
    // =========================

    if (
        data.hourly &&
        data.hourly.visibility
    ) {

        visibility.textContent =
            `${(
                data.hourly.visibility[0] /
                1000
            ).toFixed(1)} km`;

    } else {

        visibility.textContent =
            "--";
    }


    // =========================
    // HOURLY FORECAST
    // =========================

    updateHourlyForecast(
        data.hourly
    );


    // =========================
    // SUNRISE / SUNSET
    // =========================

    updateSunTimes(
        data.daily
    );
}


// =========================
// HOURLY FORECAST
// =========================

function updateHourlyForecast(
    hourly
) {

    // IMPORTANT:
    // forecastList comes from:
    // document.querySelector(".forecast-list")

    if (!forecastList) {

        console.error(
            "Forecast list was not found."
        );

        return;
    }


    // Clear old cards

    forecastList.innerHTML =
        "";


    // Show first 5 hours

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const time =
            new Date(
                hourly.time[i]
            );


        const timeText =
            time.toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric"
                }
            );


        const info =
            getWeatherInfo(
                hourly.weather_code[i],
                true
            );


        const temp =
            Math.round(
                hourly.temperature_2m[i]
            );


        // =========================
        // CARD
        // =========================

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <span>
                ${timeText}
            </span>

            <div
                class="forecast-icon"
                style="font-size: 32px;"
            >
                ${info.icon}
            </div>

            <strong>
                ${temp}°
            </strong>

        `;


        forecastList.appendChild(
            card
        );
    }
}


// =========================
// SUNRISE / SUNSET
// =========================

function updateSunTimes(
    data
) {

    if (
        !data ||
        !data.sunrise ||
        !data.sunset
    ) {

        sunrise.textContent =
            "--";

        sunset.textContent =
            "--";

        return;
    }


    // Sunrise

    const sunriseTime =
        new Date(
            data.sunrise[0]
        );


    sunrise.textContent =
        sunriseTime.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


    // Sunset

    const sunsetTime =
        new Date(
            data.sunset[0]
        );


    sunset.textContent =
        sunsetTime.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );
}


// =========================
// SEARCH BUTTON
// =========================

searchBtn.addEventListener(
    "click",
    function () {

        const city =
            cityInput.value.trim();


        if (city === "") {

            errorMessage.textContent =
                "Please enter a city name.";


            errorMessage.style.display =
                "block";


            return;
        }


        getWeather(city);
    }
);


// =========================
// ENTER KEY
// =========================

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            searchBtn.click();
        }
    }
);


// =========================
// DEFAULT CITY
// =========================

getWeather("Lahore");