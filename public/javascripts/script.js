// fetch squirrel data
async function getSquirrelData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        displaySquirrel(data)

    } catch (error) {
        console.error(error);
    }
}

getSquirrelData('https://data.cityofnewyork.us/resource/vfnx-vebw.json?$$app_token=IK8DqGYziEQa9OENUbfMRZFzU');

// markers for squirrels
function displaySquirrel(data) {
    for (let i = 0; i < data.length; i++) {

        function makeSquirrelIcon(imgcolor) {
            const squirrelIcon = L.icon({
                iconUrl: imgcolor,
                iconSize: [30, 30],
                popupAnchor: [-3, -76],
            });
            L.marker([data[i].y, data[i].x], { icon: squirrelIcon }).addTo(map);
        }

        switch (data[i].primary_fur_color) {
            case 'Cinnamon':
                makeSquirrelIcon('images/squirrel_cinnamon.png');
                break;
            case 'Gray':
                makeSquirrelIcon('images/squirrel_gray.png');
                break;
            case 'Black':
                makeSquirrelIcon('images/squirrel_black.png');
                break;
            // some squirrels have no fur color value
            default:
                makeSquirrelIcon('images/squirrel_none.png');
        }
    }
}

// map
var map = L.map('map').setView([40.7826, -73.9656], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);