// fetch squirrel data
async function getSquirrelData(url) {
    let data = [];
    try {
        const response = await fetch(url);
        data = await response.json();
        console.log(data);

        if (localStorage.getItem('squirrelData')) {
            data = JSON.parse(localStorage.getItem('squirrelData'));
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

let squirrelTable = '';

// table
function tableSquirrel(data) {
    squirrelTable = new Tabulator("#squirrelTable", {
        data: data,
        layout: "fitDataStretch",
        pagination: true,
        paginationSize: 8,
        selectableRows: 1,
        paginationCounter: "rows",
        progressiveRender: true,
        ajaxFiltering: true,
        columns: [
            { title: "Unique Squirrel ID", field: "unique_squirrel_id", minWidth: 200 },
            { title: "Age", field: "age" },
            { title: "Location", field: "location" },
            { title: "Primary Fur Color", field: "primary_fur_color" }
        ],
    });

    // click on table row, take to that squirrel + show popup
    squirrelTable.on("rowClick", function (e, row) {
        let selectedSquirrelX = (row.getData().x);
        let selectedSquirrelY = (row.getData().y);

        map.flyTo([selectedSquirrelY, selectedSquirrelX], 19);

        function makeSquirrelIcon() {
            let squirrelDivIcon = L.divIcon({
                className: 'squirrelTableInt',
                popupAnchor: [-3, -20],
            });

            let squirrelMarker = L.marker([selectedSquirrelY, selectedSquirrelX], { icon: squirrelDivIcon }).addTo(map);

            squirrelMarker.bindPopup(
                '<b>UNIQUE SQUIRREL ID</b>: ' + row.getData().unique_squirrel_id + '<br>' +
                '<b>LATITUDE</b>: ' + selectedSquirrelY + '<br>' +
                '<b>LONGITUDE</b>: '+ selectedSquirrelX + '<br>' +
                '<b>AGE</b>: ' + row.getData().age + '<br>' +
                '<b>LOCATION</b>: ' + row.getData().location + '<br>' +
                '<b>PRIMARY FUR COLOR</b>: ' + row.getData().primary_fur_color).openPopup();
        }
        makeSquirrelIcon();
    });
}


// markers for squirrels
function displaySquirrel(data) {
    for (let i = 0; i < data.length; i++) {

        let layerGroup = L.layerGroup();

        function makeSquirrelIcon(imgcolor) {
            const squirrelIcon = L.icon({
                iconUrl: imgcolor,
                iconSize: [30, 30],
                popupAnchor: [-3, -20],
            });
            let squirrelMarker = L.marker([data[i].y, data[i].x], { icon: squirrelIcon }).addTo(map);
            layerGroup = L.layerGroup([squirrelMarker]).addTo(map);

            // click on squirrel, take to squirrel + show popup
            squirrelMarker.on('click', function (e) {
                map.flyTo([squirrelMarker.getLatLng().lat, squirrelMarker.getLatLng().lng], 19);
                
                squirrelMarker.bindPopup(
                    '<b>UNIQUE SQUIRREL ID</b>: ' + data[i].unique_squirrel_id + '<br>' +
                    '<b>LATITUDE</b>: ' + squirrelMarker.getLatLng().lat + '<br>' +
                    '<b>LONGITUDE</b>: ' + squirrelMarker.getLatLng().lng + '<br>' +
                    '<b>AGE</b>: ' + data[i].age + '<br>' +
                    '<b>LOCATION</b>: ' + data[i].location + '<br>' +
                    '<b>PRIMARY FUR COLOR</b>: ' + data[i].primary_fur_color).openPopup();
            })
        }

        switch (data[i].primary_fur_color) {
            case 'Cinnamon':
                makeSquirrelIcon('images/squirrel_Cinnamonfur.png');
                break;
            case 'Gray':
                makeSquirrelIcon('images/squirrel_Grayfur.png');
                break;
            case 'Black':
                makeSquirrelIcon('images/squirrel_Blackfur.png');
                break;
            // some squirrels have no fur color value
            case undefined:
                makeSquirrelIcon('images/squirrel_undefinedfur.png');
        }

        // reset filter
        const resetButton = document.getElementById("reset");
        resetButton.addEventListener('click', function () {
            makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
            squirrelTable.clearFilter();
        })

        // sort by refresh
        const sortBy = document.getElementById("choice_choices");
        sortBy.addEventListener('change', function () {
            layerGroup.closePopup();
        })

        // sort by age
        const sortAge = document.getElementById("age_choices");
        sortAge.addEventListener('change', function () {
            layerGroup.clearLayers();
            let selectedAge = sortAge.value;

            switch (selectedAge) {
                case 'Adult':
                    if (data[i].age == 'Adult') {
                        makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                        squirrelTable.setFilter("age", "=", "Adult");
                    }
                    break;
                case 'Juvenile':
                    if (data[i].age == 'Juvenile') {
                        makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                        squirrelTable.setFilter("age", "=", "Juvenile");
                    }
                    break;
                case 'None':
                    if (data[i].age == undefined) {
                        makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                        squirrelTable.setFilter("age", "=", undefined);
                    }
                    break;
            }
        })

        // sort by location
        const sortLocation = document.getElementById("location_choices");
        sortLocation.addEventListener('change', function () {
            layerGroup.clearLayers();
            let selectedLocation = sortLocation.value;

            switch (selectedLocation) {
                case 'Above_Ground':
                    if (data[i].location == 'Above Ground') {
                        makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                        squirrelTable.setFilter("location", "=", "Above Ground");
                    }
                    break;
                case 'Ground_Plane':
                    if (data[i].location == 'Ground Plane') {
                        makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                        squirrelTable.setFilter("location", "=", "Ground Plane");
                    }
                    break;
                case 'None':
                    if (data[i].location == undefined) {
                        makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                        squirrelTable.setFilter("location", "=", undefined);
                    }
                    break;
            }
        })

        // sort by color
        const sortColor = document.getElementById("color_choices");
        sortColor.addEventListener('change', function () {
            layerGroup.clearLayers();
            let selectedColor = sortColor.value;

            switch (selectedColor) {
                case 'Cinnamon':
                    if (data[i].primary_fur_color == 'Cinnamon') {
                        makeSquirrelIcon('images/squirrel_Cinnamonfur.png');
                        squirrelTable.setFilter("primary_fur_color", "=", "Cinnamon");
                    }
                    break;
                case 'Gray':
                    if (data[i].primary_fur_color == 'Gray') {
                        makeSquirrelIcon('images/squirrel_Grayfur.png');
                        squirrelTable.setFilter("primary_fur_color", "=", "Gray");
                    }
                    break;
                case 'Black':
                    if (data[i].primary_fur_color == 'Black') {
                        makeSquirrelIcon('images/squirrel_Blackfur.png');
                        squirrelTable.setFilter("primary_fur_color", "=", "Black");
                    }
                    break;
                case 'None':
                    if (data[i].primary_fur_color == undefined) {
                        makeSquirrelIcon('images/squirrel_undefinedfur.png');
                        squirrelTable.setFilter("primary_fur_color", "=", undefined);
                    }
                    break;
            }
        })
    }
}

// map
var map = L.map('map').setView([40.7826, -73.9656], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const sortSelect = document.getElementById("choice_choices");
const sorters = document.querySelectorAll(".sorters");

sortSelect.addEventListener("change", () => {
  const choice = sortSelect.value;

  // hide all filters first
  sorters.forEach(div => div.style.display = "none");

  // show only the selected one
  if (choice === "Age") {
    document.getElementById("age_dropdown").style.display = "inline";
  } else if (choice === "Location") {
    document.getElementById("location_dropdown").style.display = "inline";
  } else if (choice === "Color") {
    document.getElementById("color_dropdown").style.display = "inline";
  }
});

document.getElementById("reset").addEventListener("click", () => {
  sorters.forEach(div => div.style.display = "none");
  sortSelect.value = "";
});
