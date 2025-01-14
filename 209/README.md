# ALM 102 Fucntionality Specs:

-   Detects presense of a person in front of the sensor.
-   Sensor outputs a `true` or `false` value the overall Player.
-   The player will play a video based on the value received from the sensor.
-   There are TWO video players for this experience.
-   Each video plays through a set. The resets if the person leaves.
-   See https://engageworks.app.box.com/file/1595500650349?s=r85e85r98lc1i3av33jbsln27ghsnpjk

## Nexmosphere Presence Sensor with Webpage

-   Allows playback of MP4 video via a Nexmosphere Presence Sensor
-   Express server to serve the webpage and capture the presence sensor events

## Windows Setup

-   Presence sensor will communicate over serial COM4 by default
-   This can change so check device manager to see which COM port the sensor is connected to

## Drivers for Mac

-   On PC the sensors will communicated over serial COM4 by default
-   On Mac you need to insall the com.prolific.driver.PL2303 driver, which you cna find in the Aopp Store under Prolific PL2303 Serial driver in utilities.
-   On Mac you need to also enable it in Driver Extension -> System Settings > General > Login Items & Extensions > Driver Extensions
-   Restart machine and run PL203 app to see if the sensor is connected, run `ls /dev/cu.*` or `ls /dev/tty.*` to see if the sensor is connected
-   If done correctly you will see `/dev/cu.PL2303G-USBtoUART1120` in the terminal

## Setup

1. Install Node.js
2. Clone this repository
3. Run `npm install` in the root directory
4. Run `npm start` to start the server
5. Open a browser and navigate to `http://localhost:5600`

## Vars

-   `PORT` - The port the server will run on
-   Make sure to check port on target: 'http://localhost:5600', in vite.config.js
-   Make sure same port is used in the Express server
