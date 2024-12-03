# Video Vue JS + Phidget

## ORDER OF OPERATIONS IS IMPORTANT USING PHIDGET SENSORS
- Open the connection
- Wait for the device to attach
- Configure device settings (like data interval)
- Start reading data

## Notes
- Videos need to be in .webm format
- Videos need to be in the public folder in video
- Video should be named `video1.webm`, `video2.webm`, etc.
- Video format can be changed if the neccessary changes are made in the code to reflect the new video format

## Installation
- Install Phigdet Controller for OS
- Check that network server is running via Phidget Control Panel
- Run exmaple.js code to verify that sensors are being captured
- Run the server via `node server.js`
- Server will log connection of sensors and log data out

## Running the Video Project
- Run the vite build via `npm run dev`
- In the browser, navigate to `localhost:5173`
- Check that videos switch based on sensor input