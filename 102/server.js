import phidget22 from 'phidget22';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 5600;
const voltageThreshold = 2.0;
const debounceDelay = 300;
const dataInterval = 100;

// Track previous states
const prevAnalogState = Array(8).fill(false);

// Create 8 voltage inputs
const voltageInputs = Array(8)
	.fill(null)
	.map((_, i) => {
		const input = new phidget22.VoltageInput();
		input.setChannel(i);
		return input;
	});

const handleAnalogVoltageChange = (voltage, port) => {
	const state = voltage > voltageThreshold;
	if (state !== prevAnalogState[port]) {
		const sensorData = {
			port: port,
			state: state,
			value: voltage,
		};
		io.emit('analogSignal', sensorData);
		console.log(`Sending analog signal: ${JSON.stringify(sensorData)}`);
		prevAnalogState[port] = state;
	}
};

// Setup voltage inputs
voltageInputs.forEach((input, index) => {
	input.onVoltageChange = (voltage) =>
		handleAnalogVoltageChange(voltage, index);
	input.onAttach = () => {
		console.log(`Attach [${index}]!`);
		input.setDataInterval(dataInterval);
	};
});

const openWithRetry = async (device, retries = 5, delay = 1000) => {
	for (let i = 0; i < retries; i++) {
		try {
			await device.open(5000);
			console.log(`Device ${device.getChannel()} opened successfully`);
			return;
		} catch (err) {
			console.error(
				`Failed to open device ${device.getChannel()}, attempt ${
					i + 1
				}/${retries}`
			);
			if (i === retries - 1) throw err;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
};

// Initialize devices
const init = async () => {
	try {
		await Promise.all(voltageInputs.map((input) => openWithRetry(input)));
		console.log('All analog inputs initialized');
	} catch (err) {
		console.error('Failed to initialize devices:', err);
		process.exit(1);
	}
};

init();

// Start server
server.listen(PORT, () => {
	console.log('Phidget  8 Analog Sensor - Server running on port 5600');
});
