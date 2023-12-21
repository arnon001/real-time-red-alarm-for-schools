const pikudHaoref = require('pikud-haoref-api');
const sound = require('sound-play');
const interval = 5000;
const city = "ירושלים - מערב";
var alertCheck = ""; // Variable to store the previous alert

// Define polling function
var poll = function () {
    // Get the current time
    var now = new Date();
    
    // Check if it's between 07:30 to 15:00 on days Sunday to Thursday
    if (now.getDay() >= 0 && now.getDay() <= 4 && now.getHours() >= 7 && now.getHours() < 15) {
        // Optional Israeli proxy if running outside Israeli borders
        // var options = {
        //     proxy: 'http://user:pass@hostname:port/'
        // };

        // Get currently active alert

        pikudHaoref.getActiveAlert(function (err, alert) {
            // Schedule polling in X millis
            setTimeout(poll, interval);
            
            // Log errors
            if (err) {
                return console.log('Retrieving active alert failed: ', err);
            }

            // Alert header
            console.log('Currently active alert:');

            // Log the alert (if any)
            console.log(alert);

            // Line break for readability
            console.log();

            // Check if the current alert is different from the previous one and in the specified city
            if (!(JSON.stringify(alert) === JSON.stringify(alertCheck)) && isAlertInCity(alert, city)) {
                startsound(alert);
                alertCheck = alert;
            } else {
                alertCheck = "";
            }
        //}, options);
        });
    } else {
        // Outside of the specified time range
        // Schedule polling in X millis
        setTimeout(poll, interval);
    }
}

function isAlertInCity(alert, targetCity) {
    // Check if the target city is in the list of cities in the alert
    return alert && alert.cities && alert.cities.includes(targetCity);
}

function startsound(alert) {
    console.log('playing sound');
    sound.play('alarm.mp3');
}

// Display a message indicating that the script is running
console.log('Running Real Time Red alarms');

// Start polling for active alert
poll();
