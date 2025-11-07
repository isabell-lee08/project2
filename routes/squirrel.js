var express = require('express');
var router = express.Router();

const MY_TOKEN = process.env.MY_TOKEN;
const MY_TOKEN_SECRET = process.env.MY_TOKEN_SECRET;

router.get('/', async function (req, res) {

    try {
        const response = await fetch('https://data.cityofnewyork.us/resource/vfnx-vebw.json?$$app_token=' + MY_TOKEN);
        let data = await response.json();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
