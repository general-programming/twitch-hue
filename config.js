let options = {
    options: {
        debug: false // Change this to true if you want to see chat logs
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "", // Enter username of the bot inside of quotes
        password: "" // Get your bots oauth key from here https://twitchapps.com/tmi/
    },
    channels: ["#"] // Enter channel name after #
};

let hueIP = ""; //Enter Hue bridge IP inside of the quotes

let hueUsername = ""; //Enter Hue username inside of the quotes. You can get your username from setup.js

let cheerOptions = {
    cheerTier1: 100,
    cheerTier2: 1000,
    cheerTier3: 5000,
    cheerTier4: 10000
    //cheerTier5: 10 (EXAMPLE)
};

let timeBetweenAlerts = 3000; //Queue system delay

let hueLamps = []; // You can put multiple Lamp ID's. (Example: let hueLamps = [2, 4])

let cheerLimit = 100;

module.exports = {
    options,
    hueIP,
    hueUsername,
    cheerOptions,
    timeBetweenAlerts,
    hueLamps,
    cheerLimit
};
