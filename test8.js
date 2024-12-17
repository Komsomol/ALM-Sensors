import phidget22 from 'phidget22';

async function testAnalogSensors() {
    const conn = new phidget22.Connection();
    await conn.connect();
    console.log("Connected to Phidget Server");

    // Analog Sensors (0-7)
    for (let i = 0; i < 8; i++) {
        const analog = new phidget22.VoltageInput();
        analog.setChannel(i);

        analog.onAttach = () => {
            console.log(`Analog Sensor ${i} attached`);
            console.log(`Serial: ${analog.getDeviceSerialNumber()}`);
        };

        analog.onVoltageChange = (voltage) => {
            const state = voltage > 3.5 ? 'true' : 'false';
            if (state === 'true') {
                console.log(`Analog Sensor ${i}: true (${voltage.toFixed(2)}V)`);
            }
        };

        await analog.open();
    }

    console.log("All 8 analog sensors initialized and listening...");
}

testAnalogSensors().catch(console.error);