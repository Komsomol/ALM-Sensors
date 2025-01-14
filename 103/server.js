import phidget22 from 'phidget22';
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 5600;
const VOLTAGE_THRESHOLD = 2.0;
const DEBOUNCE_DELAY = 300;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Serve static files
app.use(express.static(resolve(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, 'dist', 'index.html'));
});

// State tracking
const prevDigitalState = Array(9).fill(false);
const prevAnalogState = Array(8).fill(false);

async function initializePhidgets() {
    const conn = new phidget22.Connection();
    await conn.connect();
    console.log("Connected to Phidget Server");

    // Initialize 9 digital inputs
    const digitalInputs = Array(9).fill(null).map((_, i) => {
        const input = new phidget22.DigitalInput();
        input.setChannel(i);
        input.onStateChange = (state) => {
            if (state !== prevDigitalState[i]) {
              const sensorData = {
                  port: i,
                  state: !state,
                  value: !state ? 1 : 0
              };
              io.emit('onDigitalSignal', sensorData);
              console.log(`Sending Digital: ${JSON.stringify(sensorData)}`);
              prevDigitalState[i] = state;
            }
        };
        return input;
    });

    // Initialize 8 analog inputs
    const voltageInputs = Array(8).fill(null).map((_, i) => {
        const input = new phidget22.VoltageInput();
        input.setChannel(i);
        input.onVoltageChange = (voltage) => {
            const state = voltage > VOLTAGE_THRESHOLD;
            const sensorData = {
                port: i + 9, // Offset analog ports after digital
                state: state,
                value: voltage
            };
            io.emit('onAnalogSignal', sensorData);
            console.log(`Sending Analog : ${JSON.stringify(sensorData)}`);
            prevAnalogState[i] = state;
        };
        return input;
    });

    // Open all devices
    await Promise.all([
        ...digitalInputs.map(input => input.open()),
        ...voltageInputs.map(input => input.open())
    ]);

    console.log('All Phidget inputs initialized');
}

initializePhidgets().catch(err => {
    console.error('Failed to initialize:', err);
    process.exit(1);
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});