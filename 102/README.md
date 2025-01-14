# ALM 102 Fucntionality Specs:

-   4 phidget buttons.
-   Idle video plays in background.
-   Clicking a button will play a video based on the button clicked.
-   The video will play until the end and then the idle video will play again.
-   https://engageworks.app.box.com/file/1555867811355?s=kbs6y2u1zhkgyjums2cch3h020peds44

## ORDER OF OPERATIONS IS IMPORTANT USING PHIDGET SENSORS

-   Open the connection
-   Wait for the device to attach
-   Configure device settings (like data interval)
-   Start reading data

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
