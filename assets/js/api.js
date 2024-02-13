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
