// Selectors
const searchNews = document.getElementById('search-news');
const inputNews = document.getElementById("input-news");
const searchNewsBtn = document.getElementById("search-news-btn");
const toggleSideBar = document.getElementById('toggle-side-bar');
const sideBarLogo = document.getElementById('side-bar-logo');
const sideBar = document.getElementById('side-bar');
const toggleWeather = document.getElementById('toggle-weather');
const searchWeatherBtn = document.getElementById('search-weather-btn');
const weatherApp = document.getElementById('weather-app');
const inputWeather = document.querySelector('.input-weather');
const weatherBody = document.querySelector('.weather-body');
const weatherImg = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const locationNotFound = document.querySelector('.location-not-found');
const newsApp = document.getElementById('news-app');
const templeteCardNews = document.getElementById("template-news-card");

// Sidebar toggle functionality
toggleSideBar.addEventListener('click', function () {
    sideBar.classList.toggle('show');
    if (sideBar.classList.contains('show')) {
        sideBarLogo.src = 'assets/reverse.svg';
    } else {
        sideBarLogo.src = 'assets/sidebar.svg';
    }
});

document.addEventListener('click', function (event) {
    if (!sideBar.contains(event.target) && !toggleSideBar.contains(event.target)) {
        sideBar.classList.remove('show');
        sideBarLogo.src = 'assets/sidebar.svg';
    }
});

sideBar.addEventListener('mouseleave', () => {
    sideBar.style.transition = "all 0.5s";
    sideBar.classList.remove('show');
    sideBarLogo.src = 'assets/sidebar.svg';
});

// Toggle Weather App visibility
toggleWeather.addEventListener('click', function () {
    if (weatherApp.style.display === 'none') {
        weatherApp.style.display = 'block';
        toggleWeather.style.backgroundColor = 'rgb(68, 68, 240)';
        newsApp.style.display = 'none';
        searchNews.style.display = 'none';
        heading.style.display = 'none';
    } else {
        weatherApp.style.display = 'none';
        newsApp.style.display = 'flex';
        toggleWeather.style.backgroundColor = 'rgb(115, 160, 245)';
        searchNews.style.display = 'flex';
        heading.style.display = 'flex';
    }
});

// Weather API configuration
const weatherApi = "e37e3af3a090223e05c5f0f9a5f84e23";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

// Function to fetch and display weather data
async function checkWeather(city) {
    const weatherRes = await fetch(`${weatherUrl}${city}&appid=${weatherApi}`);
    const weatherData = await weatherRes.json();
    // console.log(weatherData);

    if (weatherData.cod === `404`) {
        locationNotFound.style.display = "flex";
        weatherBody.style.display = "none";
        console.log("error");
        return;
    }

    // console.log("run");
    locationNotFound.style.display = "none";
    weatherBody.style.display = "flex";
    temperature.innerHTML = `${Math.round(weatherData.main.temp - 273.15)}°C`;
    description.innerHTML = `${weatherData.weather[0].description}`;

    humidity.innerHTML = `${weatherData.main.humidity}%`;
    windSpeed.innerHTML = `${weatherData.wind.speed}Km/H`;

    switch (weatherData.weather[0].main) {
        case 'Clouds':
            weatherImg.src = "/assets/cloud.png";
            break;
        case 'Clear':
            weatherImg.src = "/assets/clear.png";
            break;
        case 'Rain':
            weatherImg.src = "/assets/rain.png";
            break;
        case 'Mist':
            weatherImg.src = "/assets/mist.png";
            break;
        case 'Snow':
            weatherImg.src = "/assets/snow.png";
            break;
    }
}

// Event listeners for weather search
searchWeatherBtn.addEventListener('click', () => {
    const city = inputWeather.value;
    if (!city) return;
    checkWeather(city);
});

inputWeather.addEventListener('keydown', function (event) {
    const city = inputWeather.value;
    if (event.key === 'Enter') {
        if (!city) return;
        checkWeather(city);
    }
});

// News API configuration
// Primary API
// const newsApi = "1234e3e8024142ef92109e5761146432";
// Secondry API
const newsApi = "69ec5597f0fa4c72b259a74257e7e98d";
const newsUrl = "https://newsapi.org/v2/everything?q=";

// Fetch news on page load
window.addEventListener("load", () => fetchNews("india"));

// Function to reload the page
function reload() {
    window.location.reload();
}

// Function to fetch and display news data
async function fetchNews(query) {
    const res = await fetch(`${newsUrl}${query}&apiKey=${newsApi}`);
    const data = await res.json();
    console.log(data);
    bindData(data.articles);
}

// Function to bind news data to the DOM
function bindData(articles) {
    newsApp.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = templeteCardNews.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        newsApp.appendChild(cardClone);
    });
}

// Function to fill data in a news card
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-GB", {
        timeZone: "Asia/Kolkata",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Function to handle sidebar item click
function onSideItemClick(id) {
    fetchNews(id);
    changeHeading(id);

    weatherApp.style.display = 'none';
    newsApp.style.display = 'flex';
    toggleWeather.style.backgroundColor = 'rgb(115, 160, 245)';
    searchNews.style.display = 'flex';
    heading.style.display = 'flex';
}

// Function to change the heading text
function changeHeading(newText) {
    heading.textContent = "News of " + newText;
}

// Event listeners for news search
searchNewsBtn.addEventListener("click", () => {
    if (!inputNews.value) return;
    fetchNews(inputNews.value);
    changeHeading(inputNews.value);
});

inputNews.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (!inputNews.value) return;
        fetchNews(inputNews.value);
        changeHeading(inputNews.value);
    }
});