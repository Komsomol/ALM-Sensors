// test-all-sensors.js
import phidget22 from 'phidget22';

async function testAllSensors() {
    const conn = new phidget22.Connection();
    await conn.connect();
    console.log("Connected to Phidget Server");

    // Digital Sensors (0-2)
    for (let i = 0; i < 3; i++) {
        const digital = new phidget22.DigitalInput();
        digital.setChannel(i);

        digital.onAttach = () => {
            console.log(`Digital Sensor ${i} attached`);
            console.log(`Serial: ${digital.getDeviceSerialNumber()}`);
        };

        digital.onStateChange = (state) => {
            console.log(`Digital Sensor ${i}: ${state ? 'true' : 'false'}`);
        };

        await digital.open();
    }

    // Analog Sensors (0-2)
    for (let i = 0; i < 3; i++) {
        const analog = new phidget22.VoltageInput();
        analog.setChannel(i);

        analog.onAttach = () => {
            console.log(`Analog Sensor ${i} attached`);
            console.log(`Serial: ${analog.getDeviceSerialNumber()}`);
        };

        analog.onVoltageChange = (voltage) => {
            const state = voltage > 3.5 ? 'true' : 'false';
            // console.log(`Analog Sensor ${i}: ${voltage.toFixed(2)}V (${state})`);
            if (state === 'true') {
                console.log(`Analog Sensor ${i}: true (${state})`);
            }
        };

        await analog.open();
    }

    console.log("All sensors initialized and listening...");
}

testAllSensors().catch(console.error);
