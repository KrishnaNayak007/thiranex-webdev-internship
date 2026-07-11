/**
 * Weather Dashboard - API Integration & State Engine
 * Orchestrates Geocoding + Forecasting Promise Chains securely.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Selectors
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    
    const searchHistory = document.getElementById('search-history');
    const weatherCard = document.getElementById('weather-card');
    const weatherPlaceholder = document.getElementById('weather-placeholder');
    const errorBox = document.getElementById('error-box');
    const errorMessage = document.getElementById('error-message');

    // UI Output Targets
    const locationTitle = document.getElementById('location-title');
    const conditionDesc = document.getElementById('condition-desc');
    const weatherGraphic = document.getElementById('weather-graphic');
    const tempVal = document.getElementById('temp-val');
    const humidityVal = document.getElementById('humidity-val');
    const windVal = document.getElementById('wind-val');

    // History Local Array
    let historyList = JSON.parse(localStorage.getItem('weather_history')) || [];

    // Initial load: Draw history pills
    renderHistory();

    // Search submit listener
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (!city) return;

        await fetchWeatherData(city);
    });

    // Event delegation on search history pills
    searchHistory.addEventListener('click', async (e) => {
        const target = e.target.closest('.history-btn');
        if (!target) return;

        const city = target.dataset.city;
        await fetchWeatherData(city);
    });

    /**
     * Primary Asynchronous Orchestrator (Executeschained API fetches)
     * @param {string} city - Raw search string input
     */
    async function fetchWeatherData(city) {
        // UI State Lock: Toggle loading flags to prevent race conditions
        toggleLoading(true);
        hideFeedbackPanels();

        try {
            // STEP 1: Execute Geocoding Query
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
            const geoResponse = await fetch(geoUrl);
            
            if (!geoResponse.ok) {
                throw new Error("Unable to establish communication with the geocoding server.");
            }

            const geoData = await geoResponse.json();
            
            // Validate search output results
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error(`Location matching '${city}' could not be identified.`);
            }

            const { latitude, longitude, name, country, admin1 } = geoData.results[0];
            const displayLocation = admin1 ? `${name}, ${admin1}, ${country}` : `${name}, ${country}`;

            // STEP 2: Chained Call - Fetch Meteorology Metrics using Coordinates
            const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
            const forecastResponse = await fetch(forecastUrl);

            if (!forecastResponse.ok) {
                throw new Error("Unable to retrieve forecasting parameters from meteorological server.");
            }

            const forecastData = await forecastResponse.json();
            const currentMetrics = forecastData.current;

            // STEP 3: Map API Response values back to the layout targets
            locationTitle.textContent = displayLocation;
            tempVal.textContent = Math.round(currentMetrics.temperature_2m);
            humidityVal.textContent = currentMetrics.relative_humidity_2m;
            windVal.textContent = currentMetrics.wind_speed_10m;

            // Map WMO interpretation parameters
            const condition = interpretWMOCode(currentMetrics.weather_code);
            conditionDesc.textContent = condition.text;
            weatherGraphic.textContent = condition.icon;

            // Success Transition displays
            weatherCard.classList.remove('hidden');
            weatherPlaceholder.classList.add('hidden');

            // STEP 4: Store query within persistence history array
            updateHistory(name);

        } catch (err) {
            // Route errors gracefully to visual error-boundaries
            errorMessage.textContent = err.message;
            errorBox.classList.remove('hidden');
            weatherPlaceholder.classList.remove('hidden');
        } finally {
            // Unlock UI Form fields
            toggleLoading(false);
            cityInput.value = ''; // Clean search fields
        }
    }

    /**
     * UI State controller (Locks form controls during server latency)
     * @param {boolean} isLoading - Active state flag
     */
    function toggleLoading(isLoading) {
        if (isLoading) {
            searchBtn.disabled = true;
            cityInput.disabled = true;
            btnText.textContent = "Updating...";
            btnSpinner.classList.remove('hidden');
        } else {
            searchBtn.disabled = false;
            cityInput.disabled = false;
            btnText.textContent = "Search Location";
            btnSpinner.classList.add('hidden');
        }
    }

    function hideFeedbackPanels() {
        weatherCard.classList.add('hidden');
        errorBox.classList.add('hidden');
    }

    /**
     * WMO Weather Interpretation Code Maps (WMO Code standard parsing)
     * @param {number} code - Numeric weather status ID from API
     */
    function interpretWMOCode(code) {
        if (code === 0) return { text: "clear sky", icon: "☀️" };
        if (code >= 1 && code <= 3) return { text: "partly cloudy", icon: "⛅" };
        if (code === 45 || code === 48) return { text: "foggy atmosphere", icon: "🌫️" };
        if (code >= 51 && code <= 65) return { text: "moderate rainfall", icon: "🌧️" };
        if (code >= 71 && code <= 77) return { text: "snow cover", icon: "❄️" };
        if (code >= 80 && code <= 82) return { text: "rain showers", icon: "🌦️" };
        if (code >= 95 && code <= 99) return { text: "thunderstorm dynamic", icon: "⚡" };
        return { text: "variable conditions", icon: "🌍" };
    }

    /**
     * Persistent history lists arrays updates
     * @param {string} city - Validated city name to append
     */
    function updateHistory(city) {
        // Prevent duplicate string arrays and restrict list lengths to 5
        historyList = historyList.filter(item => item.toLowerCase() !== city.toLowerCase());
        historyList.unshift(city);
        
        if (historyList.length > 5) {
            historyList.pop();
        }

        localStorage.setItem('weather_history', JSON.stringify(historyList));
        renderHistory();
    }

    /**
     * Renders search history button pills on the UI
     */
    function renderHistory() {
        searchHistory.innerHTML = '';
        
        if (historyList.length === 0) {
            searchHistory.innerHTML = '<p class="no-history">No recent searches.</p>';
            return;
        }

        historyList.forEach(city => {
            const btn = document.createElement('button');
            btn.className = 'history-btn';
            btn.type = 'button';
            btn.dataset.city = city;
            btn.textContent = city;
            btn.setAttribute('aria-label', `Re-query weather data for ${city}`);
            searchHistory.appendChild(btn);
        });
    }
});