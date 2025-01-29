// test-all-sensors.js
import phidget22 from 'phidget22';

async function testAllSensors() {
	const conn = new phidget22.Connection();
	await conn.connect();
	console.log('Connected to Phidget Server');

	// List connected devices
	const manager = new phidget22.Manager();
	await manager.open();

	manager.onAttach = function (device) {
		console.log(`Device attached: ${device.getName()}`);
		console.log(`Serial: ${device.getDeviceSerialNumber()}`);
		console.log(`Channel: ${device.getChannel()}`);
	};

	// Digital Sensors
	const digital = new phidget22.DigitalInput();
	digital.setChannel(0); // Assuming sensor is on channel 0

	digital.onAttach = () => {
		console.log(`Digital Sensor attached`);
		console.log(`Serial: ${digital.getDeviceSerialNumber()}`);
		console.log(`Channel: ${digital.getChannel()}`);
	};

	digital.onStateChange = (state) => {
		console.log(`Digital Sensor: ${state ? 'true' : 'false'}`);
	};

	await digital.open();

	console.log('Sensor initialized and listening...');
}

testAllSensors().catch(console.error);
