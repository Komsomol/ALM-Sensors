import phidget22 from 'phidget22';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Configuration
const PORT = process.env.PORT || 3000;
const VOLTAGE_THRESHOLD = 2.0;
const DEBOUNCE_DELAY = 300;
const DATA_INTERVAL = 100;

// Debounce utility
const debounce = (func, delay) => {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

// Express and Socket.io setup
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Static file serving
const __dirname = fileURLToPath(new URL('.', import.meta.url));
app.use(express.static(resolve(__dirname, 'dist')));

// Socket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

async function runExample() {
  const conn = new phidget22.Connection();
  await conn.connect();
  console.log("Connected to Phidget Server");

  // Initialize sensors
  const voltageInput0 = new phidget22.VoltageInput();
  const voltageInput1 = new phidget22.VoltageInput();
  const voltageInput2 = new phidget22.VoltageInput();
  const digitalInput0 = new phidget22.DigitalInput();
  const digitalInput1 = new phidget22.DigitalInput();
  const digitalInput2 = new phidget22.DigitalInput();

  // Set channels
  voltageInput0.setChannel(0);
  voltageInput1.setChannel(1);
  voltageInput2.setChannel(2);
  digitalInput0.setChannel(0);
  digitalInput1.setChannel(1);
  digitalInput2.setChannel(2);

  // State tracking
  let prevDigitalState = [false, false, false];
  let prevAnalogState = [false, false, false];

  // Event handlers
  const handleDigitalStateChange = debounce((state, port) => {
    const adjustedState = !state;
    if (adjustedState !== prevDigitalState[port]) {
      console.log(`Digital Sensor ${port}: ${adjustedState ? 'true' : 'false'}`);
      io.emit('digitalChange', { port, state: adjustedState });
      prevDigitalState[port] = adjustedState;
    }
  }, DEBOUNCE_DELAY);

  const handleAnalogVoltageChange = (voltage, port) => {
    const state = voltage > VOLTAGE_THRESHOLD;
    if (state !== prevAnalogState[port]) {
      console.log(`Analog Sensor ${port}: ${state ? 'true' : 'false'} (${voltage.toFixed(2)}V)`);
      io.emit('analogChange', { port, state, voltage });
      prevAnalogState[port] = state;
    }
  };

  // Attach event listeners
  digitalInput0.onStateChange = (state) => handleDigitalStateChange(state, 0);
  digitalInput1.onStateChange = (state) => handleDigitalStateChange(state, 1);
  digitalInput2.onStateChange = (state) => handleDigitalStateChange(state, 2);

  voltageInput0.onVoltageChange = (voltage) => handleAnalogVoltageChange(voltage, 0);
  voltageInput1.onVoltageChange = (voltage) => handleAnalogVoltageChange(voltage, 1);
  voltageInput2.onVoltageChange = (voltage) => handleAnalogVoltageChange(voltage, 2);

  // Attach handlers
  const setupAnalogSensor = (sensor, index) => {
    sensor.onAttach = () => {
      console.log(`Analog Sensor ${index} attached`);
      sensor.setDataInterval(DATA_INTERVAL);
    };
    sensor.onDetach = () => {
      console.log(`Analog Sensor ${index} detached`);
    };
    sensor.onError = (code, description) => {
      console.error(`Analog Sensor ${index} error: ${description}`);
    };
  };

  setupAnalogSensor(voltageInput0, 0);
  setupAnalogSensor(voltageInput1, 1);
  setupAnalogSensor(voltageInput2, 2);

  // Retry utility
  const openWithRetry = async (device, retries = 5, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await device.open(5000);
        console.log(`Device ${device.getChannel()} opened successfully`);
        return;
      } catch (err) {
        if (i < retries - 1) {
          console.error(`Open attempt ${i + 1} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw err;
        }
      }
    }
  };

  // Open all sensors
  try {
    await Promise.all([
      openWithRetry(voltageInput0),
      openWithRetry(voltageInput1),
      openWithRetry(voltageInput2),
      openWithRetry(digitalInput0),
      openWithRetry(digitalInput1),
      openWithRetry(digitalInput2)
    ]);
    console.log("All sensors initialized successfully");
  } catch (err) {
    console.error('Error during sensor initialization:', err);
    process.exit(1);
  }

  // Cleanup function
  async function closeAll() {
    try {
      await Promise.all([
        voltageInput0.close(),
        voltageInput1.close(),
        voltageInput2.close(),
        digitalInput0.close(),
        digitalInput1.close(),
        digitalInput2.close()
      ]);
      conn.close();
      conn.delete();
      console.log('All sensors and connection closed');
    } catch (err) {
      console.error('Error during cleanup:', err);
    }
  }

  // Termination handlers
  process.on('SIGINT', async () => {
    console.log('Caught interrupt signal (Ctrl+C)');
    await closeAll();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Caught termination signal');
    await closeAll();
    process.exit(0);
  });
}

// Start everything
Promise.all([
  new Promise(resolve => server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    resolve();
  })),
  runExample()
]).catch(error => {
  console.error('Startup error:', error);
  process.exit(1);
});