// fetch squirrel data
async function getSquirrelData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error(error);
    }
}

getSquirrelData('https://data.cityofnewyork.us/resource/vfnx-vebw.json?$$app_token=IK8DqGYziEQa9OENUbfMRZFzU');

// map
var map = L.map('map').setView([40.7826, -73.9656], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);