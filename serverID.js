import phidget22 from 'phidget22';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Debounce function to limit the rate at which a function can fire
const debounce = (func, delay) => {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the Vite build directory
const __dirname = fileURLToPath(new URL('.', import.meta.url));
app.use(express.static(resolve(__dirname, 'dist')));

async function runExample() {
  const conn = new phidget22.Connection();
  await conn.connect();
  console.log("Connected to Phidget Server");

  const voltageInput0 = new phidget22.VoltageInput();
  const voltageInput1 = new phidget22.VoltageInput();
  const voltageInput2 = new phidget22.VoltageInput();
  const digitalInput0 = new phidget22.DigitalInput();
  const digitalInput1 = new phidget22.DigitalInput();
  const digitalInput2 = new phidget22.DigitalInput();

  voltageInput0.setChannel(0);
  voltageInput1.setChannel(1);
  voltageInput2.setChannel(2);
  digitalInput0.setChannel(0);
  digitalInput1.setChannel(1);
  digitalInput2.setChannel(2);

  const debounceDelay = 300; // Adjust the debounce delay as needed
  const voltageThreshold = 2.0; // Set the threshold voltage

  // Track previous states
  let prevDigitalState = [false, false, false];
  let prevAnalogState = [false, false, false];

  const handleDigitalStateChange = debounce((state, port) => {
    const adjustedState = !state;
    if (adjustedState !== prevDigitalState[port]) {
      const serialNumber = digitalInput0.getDeviceSerialNumber();
      console.log(`Digital Sensor ${serialNumber}: ${adjustedState ? 'true' : 'false'}`);
      io.emit('digitalChange', { 
        port,
        state: adjustedState,
        serialNumber
      });
      prevDigitalState[port] = adjustedState;
    }
  }, debounceDelay);
  
  const handleAnalogVoltageChange = (voltage, port) => {
    const state = voltage > voltageThreshold;
    if (state !== prevAnalogState[port]) {
      const serialNumber = voltageInput0.getDeviceSerialNumber();
      console.log(`Analog Sensor ${serialNumber}: ${state ? 'true' : 'false'} (${voltage}V)`);
      io.emit('analogChange', { 
        port,
        state,
        voltage,
        serialNumber
      });
      prevAnalogState[port] = state;
    }
  };

  digitalInput0.onStateChange = (state) => handleDigitalStateChange(state, 0);
  digitalInput1.onStateChange = (state) => handleDigitalStateChange(state, 1);
  digitalInput2.onStateChange = (state) => handleDigitalStateChange(state, 2);

  voltageInput0.onVoltageChange = (voltage) => handleAnalogVoltageChange(voltage, 0);
  voltageInput1.onVoltageChange = (voltage) => handleAnalogVoltageChange(voltage, 1);
  voltageInput2.onVoltageChange = (voltage) => handleAnalogVoltageChange(voltage, 2);

  // Set data interval inside the onAttach event handler
  voltageInput0.onAttach = () => {
    console.log('Attach [0]!');
    voltageInput0.setDataInterval(100);
  };

  voltageInput1.onAttach = () => {
    console.log('Attach [1]!');
    voltageInput1.setDataInterval(100);
  };

  voltageInput2.onAttach = () => {
    console.log('Attach [2]!');
    voltageInput2.setDataInterval(100);
  };

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

  const openPromiseList = [
    openWithRetry(voltageInput0),
    openWithRetry(voltageInput1),
    openWithRetry(voltageInput2),
    openWithRetry(digitalInput0),
    openWithRetry(digitalInput1),
    openWithRetry(digitalInput2)
  ];

  try {
    await Promise.all(openPromiseList);
    console.log("All sensors initialized successfully");
  } catch (err) {
    console.error('Error during open', err);
    process.exit(1);
  }

  // Cleanup function
  async function closeAll() {
    await voltageInput0.close();
    await voltageInput1.close();
    await voltageInput2.close();
    await digitalInput0.close();
    await digitalInput1.close();
    await digitalInput2.close();
    conn.close();
    conn.delete();
    console.log('All sensors and connection closed');
  }

  // Handle termination signal
  process.on('SIGINT', async () => {
    console.log('Caught interrupt signal (Ctrl+C), closing sensors...');
    await closeAll();
    process.exit(0);
  });
}

runExample().catch(console.error);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});