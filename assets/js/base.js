import '../styles/style.css';
const searchIcon = document.querySelector('#searchIcon');
const crossIcon = document.querySelector('#crossIcon');
const searchBar = document.querySelector('#searchBar');
const searchInput = document.querySelector('#search-input');
const dropdown = document.querySelector('.result-box ul');
const dataCorner = document.querySelector('#dataCorner');

searchIcon.addEventListener('click', () => {
    searchBar.classList.toggle('active');
});
crossIcon.addEventListener('click', () => {
    searchBar.classList.toggle('active');
});


searchInput.addEventListener('input', async (event) => {
    if (searchInput.value === '') {
        document.querySelector('.result-box ul').innerHTML = '';
    } else {
        const inputValue = event.target.value.toLowerCase();
        const response = await fetch(`https://restcountries.com/v3.1/name/${inputValue}`);
        const data = await response.json();
        const countries = data.map((country) => country.name.common);
        const dropdown = document.querySelector('.result-box ul');
        dropdown.innerHTML = '';
        countries.forEach((country) => {
            const listItem = document.createElement('li');
            listItem.textContent = country;
            dropdown.appendChild(listItem);
        });
    }
});
dropdown.addEventListener('click', async (event) => {
    const selectedCountry = event.target.textContent;
    const response = await fetch(`https://restcountries.com/v3.1/name/${selectedCountry}`);
    const data = await response.json();
    const countryData = data.filter(elem => elem.name.common.toLowerCase() === selectedCountry.toLowerCase())[0];
    const { name, population, latlng } = countryData;
    const flagUrl = countryData.flags.png;
    const [latitude, longitude] = latlng;
    createDataPoint(latitude, longitude, flagUrl, { name, population });
    searchBar.classList.toggle('active');
    searchInput.value = '';
    dropdown.innerHTML = '';
    const dataObj = {
        countryName: countryData.name.common ? countryData.name.common : 'N/A',
        capital: countryData.capital ? countryData.capital[0] : "N/A",
        population: countryData.population ? countryData.population : "N/A",
        area: countryData.area ? countryData.area : "N/A",
        currencyName: countryData.currencies ? Object.values(countryData.currencies)[0].name : "N/A",
        currencySymbol: countryData.currencies ? Object.values(countryData.currencies)[0].symbol : "N/A",
        timezone: countryData.timezones ? countryData.timezones[0] : "N/A",
        region: countryData.region ? countryData.region : "N/A",
        latitude: countryData.latlng ? countryData.latlng[0] : "N/A",
        longitude: countryData.latlng ? countryData.latlng[1] : "N/A",
        flagUrl: flagUrl ? flagUrl : "N/A",
        map: countryData.maps ? countryData.maps.googleMaps : "N/A"
    };
    showDataCorner(dataObj);
});

function formatNumber(number) {
    if (number < 1000) {
        return number.toFixed(2);
    } else if (number < 1000000) {
        return (number / 1000).toFixed(2) + 'K';
    } else if (number < 1000000000) {
        return (number / 1000000).toFixed(2) + 'M';
    } else {
        return (number / 1000000000).toFixed(2) + 'B';
    }
}

function showDataCorner(dataObj) {
    // Get the current date and time
    const currentDate = new Date();

    // Format the date
    const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', optionsDate);

    // Format the time
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = currentDate.toLocaleTimeString('en-US', optionsTime);

    // console.log(dataObj);
    const dataChild = document.createElement('div');
    dataChild.className = 'data-box';
    dataChild.innerHTML = `
        <!-- Data Header -->
        <div class="data-header">
          <img src="${dataObj.flagUrl}" alt="${dataObj.countryName}/png" />
          <div class="added-on">
            <span>${formattedDate}</span>
            <span>${formattedTime}</span>
          </div>
        </div>

        <!-- Data Body -->
        <div class="data-body">
          <ul>
            <li>Country: ${dataObj.countryName}</li>
            <li>Capital: ${dataObj.capital}</li>
            <li>Population: ${formatNumber(dataObj.population)}</li>
            ${dataObj.currencyName === 'N/A' ? `<li>Currency: ${dataObj.currencyName}</li>` : `<li>Currency: ${dataObj.currencyName}(${dataObj.currencySymbol})</li>`}
            <li>Timezone: ${dataObj.timezone}</li>
            <li>Continent: ${dataObj.region}</li>
            <li>Latitude: ${dataObj.latitude}°N</li>
            <li>Longitude: ${dataObj.longitude}°N</li>
            <li>Area: ${formatNumber(dataObj.area)} sq.km</li>
        </div>

        <a href="${dataObj.map}" target='_blank'>Open Map</a>
    `;

    document.querySelector('#dataContent').appendChild(dataChild);
    document.querySelector('.clip-icon').classList.add('active');
    emptyWarn();
};

const emptyWarn = () => {
    document.querySelector('#emptyTag').style.display = document.querySelector('#dataContent').childElementCount === 0 ? 'block' : 'none';
}
emptyWarn();
