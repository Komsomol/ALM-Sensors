import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

// Create a port instance
const port = new SerialPort({
	path: '/dev/tty.PL2303G-USBtoUART1120', // Mac port name
	baudRate: 115200, // Default baud rate, adjust if needed
	dataBits: 8,
	stopBits: 1,
	parity: 'none',
});

// Create a parser to read data line by line
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Handle port opening
port.on('open', () => {
	console.log('Serial port opened successfully');
});

// Read data from the port
parser.on('data', (data) => {
	console.log('Received data:', data);
});

// Handle errors
port.on('error', (err) => {
	console.error('Error:', err.message);
});
