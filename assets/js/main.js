// import * as THREE from 'three';
import '../styles/style.css';
// import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


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


// Scene:
const scene = new THREE.Scene();

// Sizes:
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Camera:
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

// Renderer:
const canvas = document.querySelector('#globe-container');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Resize:
window.addEventListener('resize', () => {
  // Update sizes:
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera:
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Creating the Earth Globe:
const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  roughness: 1,
  metalness: 0,
  map: new THREE.TextureLoader().load('https://i.ibb.co/frPfGFW/earth-day-map.jpg'),
  bumpMap: new THREE.TextureLoader().load('https://i.ibb.co/St1Tgc3/earthbump.jpg'),
  bumpScale: 10
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Ambient Light:
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Point Light:
const pointerLight = new THREE.PointLight(0xffffff, 0.7);

// Light Position:
pointerLight.position.set(10, 10, 10);
scene.add(pointerLight);

// Cloud:
const cloudGeometry = new THREE.SphereGeometry(5.15, 64, 64);
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load('https://i.ibb.co/CsytfFt/earth-Cloud.png'),
  transparent: true
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

// Star:
const starGeometry = new THREE.SphereGeometry(80, 64, 64);
const starMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('https://i.ibb.co/51H5fgW/stars-milky-way.jpg'),
  side: THREE.BackSide
});
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);

// Animate the Globe:
function animate() {
  requestAnimationFrame(animate);

  // Rotate the Cloud:
  cloudMesh.rotation.y -= 0.001;

  // Move the Stars:
  starMesh.rotation.y += 0.0005;

  renderer.render(scene, camera);
}
animate();

// Interactivity:
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Assuming GSAP has been included via script tag
const t1 = gsap.timeline({
  defaults: { duration: 1 }
});
t1.fromTo(earthMesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 0);
t1.fromTo(cloudMesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 0);

// Function to convert latitude and longitude to a vector3 for Three.js
function latLongToVector3(latitude, longitude, radius, height) {
  var phi = (latitude) * Math.PI / 180;
  var theta = (longitude - 180) * Math.PI / 180;

  var x = -(radius + height) * Math.cos(phi) * Math.cos(theta);
  var y = (radius + height) * Math.sin(phi);
  var z = (radius + height) * Math.cos(phi) * Math.sin(theta);

  // Rotate the point to match the Earth's rotation
  var earthRotation = earthMesh.rotation;
  var x_rot = x * Math.cos(earthRotation.y) - z * Math.sin(earthRotation.y);
  var z_rot = x * Math.sin(earthRotation.y) + z * Math.cos(earthRotation.y);

  return new THREE.Vector3(x_rot, y, z_rot);
}

// Function to fetch population data for a specific country
async function fetchPopulationData(countryName) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const countryData = data.filter(elem => elem.name.common.toLowerCase() === countryName.toLowerCase())[0];
      updatePopulationData(countryData);
    } else {
      console.error('No data found for the specified country.');
    }
  } catch (error) {
    console.error('Error fetching population data:', error);
  }
}

// Function to update the globe with population data
function updatePopulationData(countryData) {
  // Extract relevant information from the country data
  const { name, population, latlng } = countryData;
  const [latitude, longitude] = latlng;

  // Create a data point on the globe
  createDataPoint(latitude, longitude, { name, population });
}

function createDataPoint(lat, lon, flagUrl, data) {
  var pointGeometry = new THREE.SphereGeometry(0, 64, 64);
  var pointMaterial = new THREE.MeshBasicMaterial({ color: 0xfff });
  var pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
  pointMesh.name = 'pointMesh';

  // Calculate the position of the point based on the latitude and longitude
  var position = latLongToVector3(lat, lon, 5.3, 0.1); // Assuming Earth radius is 5
  var earthRotation = earthMesh.rotation;
  var x = position.x * Math.cos(earthRotation.y) - position.z * Math.sin(earthRotation.y);
  var z = position.x * Math.sin(earthRotation.y) + position.z * Math.cos(earthRotation.y);
  pointMesh.position.set(x, position.y, z);

  var flagTexture = new THREE.TextureLoader().load(`${flagUrl}`);
  var flagMaterial = new THREE.SpriteMaterial({ map: flagTexture });
  var flagSprite = new THREE.Sprite(flagMaterial);
  flagSprite.scale.set(0.45, 0.35, 0.45);
  flagSprite.position.copy(pointMesh.position);
  scene.add(flagSprite);

  // Store data in the mesh for later use
  pointMesh.userData = data;

  scene.add(pointMesh);
}
