// fetch squirrel data
async function getSquirrelData(url) {
    let data = [];
    try {
        const response = await fetch(url);
        data = await response.json();
        console.log(data);

        if (localStorage.getItem('squirrelData')) {
            data = JSON.parse(localStorage.getItem('squirrelData'));
            console.log(data);
            console.log('localStorage works')
        } else {
            localStorage.setItem('squirrelData', JSON.stringify(data));
        }

    } catch (error) {
        console.error(error);
    }
    displaySquirrel(data);
    tableSquirrel(data);
}

getSquirrelData('/api/squirrel');

function tableSquirrel(data) {
    const squirrelTable = new Tabulator("#squirrelTable", {
        data: data,
        layout: "fitDataStretch",
        pagination: true,
        paginationSize: 25,
        paginationCounter: "rows",
        columns: [
            { title: "Unique Squirrel ID", field: "unique_squirrel_id", minWidth: 200 },
            { title: "Age", field: "age" },
            { title: "Location", field: "location" },
            { title: "Primary Fur Color", field: "primary_fur_color" }
        ],
    });
}


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
var map = L.map('map').setView([40.7826, -73.9656], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
