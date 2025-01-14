## ALM Sensors Project

-   102 = 4 phidget sensors
-   103 = 16 phidget sensors
-   209 = Nexmosphere Presence sensor

### Introduction

-   Node js application that reads data from a sensor and sends it to a server.
-   The server plays back a video based on the data received.
-   The sensors all have debounce enabled to prevent multiple readings from being sent.

### Installation

-   Clone the repository
-   Run `npm install` in the needed directories
-   Run `npm start` in the needed directories

### Sensors Server and Web App

-   The server will be running on `localhost:5600`
-   This will capture the data from the sensors and play the video based on the data received.
-   The video will be played in the browser. Since chrome does not allow this we need to use the Electron app to play the video.

### Electron App

-   The electron app is used to play the video.
-   Build the electron app using `npm run build` in the electron directory.
-   Check the `dist` directory for the built app.
-   Run the app using the executable file.
-   Input the `localhost:5600` in the input field and click on the `Launch` button.
-   To quit on Max OS use `Cmd + Q` and on Windows use `Ctrl + Q`.

## Video

-   convert.js will convert and passed video directroty to complatiable format for electron app.
-   `node convert.js videos/102/` will convert all videos in the directory to a compatible format for the electron app.

## Usage

-   Run the needed sensor server via docker or npm.
-   Run the electron app.
-   Input the server address in the input field and click on the `Launch` button.
-   The video will be played based on the data received from the sensors.

## Notes

-   For Prense using Nexmosphere presence sensor, there is a debounce event in sensorStore.js
-   For the other sensors, the debounce event is in the server.js files
-   Videos need to be in MP4 format and placed in the `public\videos` directory in the server directory.
-   Video files are named `video0.mp4` check `sensorStore.js` for the video file name.
-   The video will be played based on `port` from sent from phidgets sensors.
-   for the Prense sensor, the video will be played based on the `presence` event. Which sends a `true` or `false` value.

## Mac OS and Nexmosphere Prense Sensor

-   This will need the prolific driver from the App Store to work.
-   The driver is needed for the Nexmosphere Prense sensor to work on Mac OS.
-   The driver is not needed for Windows.
-   Install the driver from the App Store and restart the computer.

## Docker

-   Docker files are included in the server directory.
-   Run `docker-compose up` in the server directory to run the server.
-   The server will be running on `localhost:5600`

## Tested Sensors

-   Nexmosphere Prense sensor - Presence sensor - WORKING
-   Phidgets 8 Analog sensor - Analog Event on port - NEEDS TESTING
-   Phidgets Mixed Analog Digital sensor - analog/digital on port - NEEDS TESTING

## Autostart using PM2

-   Install `npm install pm2 --save`
-   Run `pm2 start server.js --name alm-sensors` in the server directory
-   `pm2 stop alm-sensors` to stop the server
-   `pm2 delete alm-sensors` to delete the server
-   `pm2 startup` to start pm2 on boot
-   `pm2 save` to save the current pm2 configuration
-   `pm2 list` to list all the pm2 processes
-   `pm2 logs alm-sensors` to view the logs of the server
-   `pm2 monit` to monitor the server

## Test Video

-   A test video is included in the `public\videos` directory in Presence directory.
