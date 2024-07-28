document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    getWeatherData(city);
});

document.querySelectorAll('.city-btn').forEach(button => {
    button.addEventListener('click', function () {
        const city = this.getAttribute('data-city');
        getWeatherData(city);
    });
});

async function getWeatherData(city) {
    const apiKey = 'claveAPI';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
        changeBackgroundVideo(data.weather[0].main, data.main.temp);
    } catch (error) {
        console.error(error);
        alert('Error al obtener los datos del clima. Por favor, intenta nuevamente.');
    }
}

function displayWeather(data) {
    const weatherDataDiv = document.getElementById('weatherData');
    const cityName = document.getElementById('cityName');
    const temperature = document.getElementById('temperature');
    const currentDate = document.getElementById('currentDate');

    if (data.cod === 200) {
        let rain = data.rain ? (data.rain['1h'] || data.rain['3h']) : 0;
        let snow = data.snow ? (data.snow['1h'] || data.snow['3h']) : 0;
        let date = new Date().toLocaleDateString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        cityName.innerText = data.name;
        temperature.innerText = `${data.main.temp.toFixed(2)}°C`;
        currentDate.innerText = date;

        weatherDataDiv.innerHTML = `
            <p><i class="fas fa-tint"></i> Humedad: ${data.main.humidity}%</p>
            <p><i class="fas fa-cloud-sun"></i> Condiciones: ${data.weather[0].description}</p>
            ${rain > 0 ? `<p><i class="fas fa-cloud-rain"></i> Precipitación (lluvia): ${rain} mm</p>` : ''}
            ${snow > 0 ? `<p><i class="fas fa-snowflake"></i> Precipitación (nieve): ${snow} mm</p>` : ''}
        `;
    } else {
        weatherDataDiv.innerHTML = `<p>${data.message}</p>`;
    }
}

function changeBackgroundVideo(weatherCondition, temperature) {
    const video = document.getElementById('backgroundVideo');
    let videoSource = '';

    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            videoSource = './assets/video/sunny.mp4';
            break;
        case 'rain':
            videoSource = './assets/video/rainy.mp4';
            break;
        case 'clouds':
            videoSource = './assets/video/cloudy.mp4';
            break;
        case 'snow':
            videoSource = './assets/video/snowy.mp4';
            break;
        default:
            break;
    }

    if (video.src !== videoSource) {
        video.src = videoSource;
        video.load();
        video.play();
    }
}
