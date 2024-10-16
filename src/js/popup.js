browser.runtime.onMessage.addListener((message) => {
        updateWeatherUI(message);
});

function updateWeatherUI(weatherData) {
    // Lógica de atualização do UI com base nos dados fornecidos
    document.getElementById("city").textContent = weatherData.city;
    document.getElementById("description").textContent = weatherData.description;
    document.getElementById("temperature").textContent = weatherData.temperature;
    document.getElementById("temperatureMin").textContent = weatherData.tempMin;
    document.getElementById("temperatureMax").textContent = weatherData.tempMax;
    document.getElementById("humidity").textContent = weatherData.humidity;
    document.getElementById("wind").textContent = weatherData.wind;
    document.getElementById("gust").textContent = weatherData.gust;
    document.getElementById("tempMinTomorrow").textContent = weatherData.tempMinTomorrow;
    document.getElementById("tempMaxTomorrow").textContent = weatherData.tempMaxTomorrow;
    document.getElementById("weatherTomorrow").textContent = weatherData.weatherTomorrow;
    document.getElementById("imageWeatherTomorrow").src = weatherData.imageWeatherTomorrow;
    document.getElementById("tempMinAfterTomorrow").textContent = weatherData.tempMinAfterTomorrow;
    document.getElementById("tempMaxAfterTomorrow").textContent = weatherData.tempMaxAfterTomorrow;
    document.getElementById("weatherAfterTomorrow").textContent = weatherData.weatherAfterTomorrow;
    document.getElementById("imageWeatherAfterTomorrow").src = weatherData.imageWeatherAfterTomorrow;
}
