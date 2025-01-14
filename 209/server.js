import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { platform } from 'os'; // Add os import

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PORT = 5600;
const DEBOUNCE_TIME = 1000;

// Function to get port path based on OS
const getPortPath = () => {
	const os = platform();
	switch (os) {
		case 'darwin': // macOS
			console.log('macOS detected');
			return '/dev/tty.PL2303G-USBtoUART1120';
		case 'win32': // Windows
			console.log('Windows detected');
			return 'COM4';
		default:
			throw new Error(`Unsupported operating system: ${os}`);
	}
};

const SERIAL_CONFIG = {
	path: getPortPath(),
	baudRate: 115200,
	dataBits: 8,
	parity: 'none',
	stopBits: 1,
};

// Setup Express and Socket.io
const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Initialize Serial Port
const port = new SerialPort(SERIAL_CONFIG);
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Server web page
app.use(express.static(resolve(__dirname, 'dist')));

// Fallback route for SPA
app.get('*', (req, res) => {
	res.sendFile(resolve(__dirname, 'dist', 'index.html'));
});

// State Management
let isProcessing = false;
let lastValue = null;

// Debounce Implementation
const processValue = (value) => {
	if (isProcessing) return;
	if (value === lastValue) return;

	isProcessing = true;
	lastValue = value;

	const sensorData = {
		port: 0,
		state: value > 0,
		value: value,
	};

	io.emit('presenceChange', sensorData);
	console.log(`Presence: ${JSON.stringify(sensorData)}`);

	setTimeout(() => {
		isProcessing = false;
	}, DEBOUNCE_TIME);
};

// Parse XY-240 Data Format
const parseValue = (data) => {
	console.log(data);
	const match = data.match(/X001B\[Dz=(\d{2}|XX)\]/);
	if (!match) return null;
	return match[1] === 'XX' ? 0 : parseInt(match[1], 10);
};

// Serial Port Event Handlers
port.on('open', () => {
	console.log('XY-240 sensor connected on COM4');
});

port.on('error', (err) => {
	console.error('Serial port error:', err.message);
});

parser.on('data', (data) => {
	const value = parseValue(data);
	if (value !== null) {
		processValue(value);
	}
});

// Socket.io Connection Handling
io.on('connection', (socket) => {
	console.log('Client connected to XY-240 handler');
	socket.on('disconnect', () => {
		console.log('Client disconnected from XY-240 handler');
	});
});

// Cleanup Handlers
const cleanup = () => {
	if (port.isOpen) {
		port.close(() => {
			console.log('Serial port closed');
			process.exit(0);
		});
	} else {
		process.exit(0);
	}
};

process.on('SIGINT', () => {
	console.log('Shutting down XY-240 handler...');
	cleanup();
});

process.on('SIGTERM', () => {
	console.log('Terminating XY-240 handler...');
	cleanup();
});

// Start Server
server.listen(PORT, () => {
	console.log(`XY-240 handler running on port ${PORT}`);
});
