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