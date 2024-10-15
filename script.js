async function getWeather(cityName) {
  try {
    errorMessage.style.display = 'none'; // Hide error message
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3`);
    
    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();
    // Update current weather
    degrees.textContent = data.current.temp_c + '°C';
    city.textContent = data.location.name;

    // Display forecast data for the next 3 days
    forecastContainer.innerHTML = ''; // Clear previous forecast
    data.forecast.forecastday.forEach(item => {
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
        <h3>${new Date(item.date).toLocaleDateString()}</h3>
        <p>${item.day.avgtemp_c}°C</p>
        <p>${item.day.condition.text}</p>
      `;
      forecastContainer.appendChild(forecastItem);
    });

  } catch (error) {
    console.error('Error fetching weather data:', error);
    errorMessage.textContent = error.message; // Display error message
    errorMessage.style.display = 'block'; // Show error message
  }


} 
window.onload = () => {
    const defaultCity = 'Dhaka';
    getWeather(defaultCity);
  }