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

let squirrelTable = '';

// table
function tableSquirrel(data) {
    squirrelTable = new Tabulator("#squirrelTable", {
        data: data,
        layout: "fitDataStretch",
        pagination: true,
        paginationSize: 25,
        selectableRows: 1,
        paginationCounter: "rows",
        columns: [
            { title: "Unique Squirrel ID", field: "unique_squirrel_id", minWidth: 200 },
            { title: "Age", field: "age" },
            { title: "Location", field: "location" },
            { title: "Primary Fur Color", field: "primary_fur_color" }
        ],
    });

    squirrelTable.on("rowClick", function (e, row) {
        let selectedSquirrelX = (row.getData().x);
        let selectedSquirrelY = (row.getData().y);

        map.flyTo([selectedSquirrelY, selectedSquirrelX], 19);
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
                popupAnchor: [-3, -76],
            });
            let squirrelMarker = L.marker([data[i].y, data[i].x], { icon: squirrelIcon }).addTo(map);
            layerGroup = L.layerGroup([squirrelMarker]).addTo(map);
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

        // sort by
        const sortBy = document.getElementById("choice_choices");
        sortBy.addEventListener('change', function () {
            for (let element of document.getElementsByClassName("sorters")) {
                element.style.display = "none";
            }
            switch (this.value) {
                case 'Default':
                    break;
                case 'Age':
                    document.getElementById("age_dropdown").style.display = "block";
                    break;
                case 'Location':
                    document.getElementById("location_dropdown").style.display = "block";
                    break;
                case 'Color':
                    document.getElementById("color_dropdown").style.display = "block";
                    break;
            }
        })

        // sort by age
        const sortAge = document.getElementById("age_choices");
        sortAge.addEventListener('change', function () {
            layerGroup.remove();
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
                case 'Default':
                    makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                    squirrelTable.clearFilter();
            }
        })

        // sort by location
        const sortLocation = document.getElementById("location_choices");
        sortLocation.addEventListener('change', function () {
            layerGroup.remove();
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
                case 'Default':
                    makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                    squirrelTable.clearFilter();
            }
        })

        // sort by color
        const sortColor = document.getElementById("color_choices");
        sortColor.addEventListener('change', function () {
            layerGroup.remove();
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
                case 'Default':
                    makeSquirrelIcon('images/squirrel_' + data[i].primary_fur_color + 'fur.png');
                    squirrelTable.clearFilter();
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
