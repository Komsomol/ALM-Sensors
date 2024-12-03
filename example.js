
import phidget22 from 'phidget22';

const debounce = (func, delay) => {
	let debounceTimer;
	return function() {
	  const context = this;
	  const args = arguments;
	  clearTimeout(debounceTimer);
	  debounceTimer = setTimeout(() => func.apply(context, args), delay);
	};
  };

async function runExample() {
	const conn = new phidget22.NetworkConnection(5661, 'localhost');
	try {
		await conn.connect();
	} catch(err) {
		console.error('Error during connect', err);
		process.exit(1);
	}

	//Create your Phidget channels
	const voltageInput0 = new phidget22.VoltageInput();
	const voltageInput1 = new phidget22.VoltageInput();
	const voltageInput2 = new phidget22.VoltageInput();
	
	const digitalInput0 = new phidget22.DigitalInput();
	const digitalInput1 = new phidget22.DigitalInput();
	const digitalInput2 = new phidget22.DigitalInput();

	//Set addressing parameters to specify which channel to open (if any)
	voltageInput0.setChannel(0);
	voltageInput1.setChannel(1);
	voltageInput2.setChannel(2);
	
	digitalInput0.setChannel(0);
	digitalInput1.setChannel(1);
	digitalInput2.setChannel(2);

	//Assign any event handlers you need before calling open so that no events are missed.
	voltageInput0.onVoltageChange = (voltage) => {
		console.log('Voltage [0]: ' + voltage.toString());
	};

	voltageInput0.onAttach = () => {
		console.log('Attach [0]!');
	};

	voltageInput0.onDetach = () => {
		console.log('Detach [0]!');
	};

	voltageInput0.onError = (code, description) => {
		console.log('Description [0]: ' + description.toString());
		console.log('----------');
	};

	voltageInput1.onVoltageChange = (voltage) => {
		console.log('Voltage [1]: ' + voltage.toString());
	};

	voltageInput1.onAttach = () => {
		console.log('Attach [1]!');
	};

	voltageInput1.onDetach = () => {
		console.log('Detach [1]!');
	};

	voltageInput1.onError = (code, description) => {
		console.log('Description [1]: ' + description.toString());
		console.log('----------');
	};

	voltageInput2.onVoltageChange = (voltage) => {
		console.log('Voltage [2]: ' + voltage.toString());
	};

	voltageInput2.onAttach = () => {
		console.log('Attach [2]!');
	};

	voltageInput2.onDetach = () => {
		console.log('Detach [2]!');
	};

	voltageInput2.onError = (code, description) => {
		console.log('Description [2]: ' + description.toString());
		console.log('----------');
	};

	digitalInput0.onStateChange = (state) => {
		console.log('State [0]: ' + state.toString());
	};

	digitalInput0.onAttach = () => {
		console.log('Attach [0]!');
	};

	digitalInput0.onDetach = () => {
		console.log('Detach [0]!');
	};

	digitalInput0.onError = (code, description) => {
		console.log('Description [0]: ' + description.toString());
		console.log('----------');
	};

	digitalInput1.onStateChange = (state) => {
		console.log('State [1]: ' + state.toString());
	};

	digitalInput1.onAttach = () => {
		console.log('Attach [1]!');
	};

	digitalInput1.onDetach = () => {
		console.log('Detach [1]!');
	};

	digitalInput1.onError = (code, description) => {
		console.log('Description [1]: ' + description.toString());
		console.log('----------');
	};

	digitalInput2.onStateChange = (state) => {
		console.log('State [2]: ' + state.toString());
	};

	digitalInput2.onAttach = () => {
		console.log('Attach [2]!');
	};

	digitalInput2.onDetach = () => {
		console.log('Detach [2]!');
	};

	digitalInput2.onError = (code, description) => {
		console.log('Description [2]: ' + description.toString());
		console.log('----------');
	};

	//Open your Phidgets and wait for attachment
	const openPromiseList = [];
	openPromiseList.push(voltageInput0.open(5000));
	openPromiseList.push(voltageInput1.open(5000));
	openPromiseList.push(voltageInput2.open(5000));
	openPromiseList.push(digitalInput0.open(5000));
	openPromiseList.push(digitalInput1.open(5000));
	openPromiseList.push(digitalInput2.open(5000));

	try {
		await Promise.all(openPromiseList);
	} catch(err) {
		console.error('Error during open', err);
		process.exit(1);
	}

	//Do stuff with your Phidgets here or in your event handlers.

	setTimeout(async () => {
		//Close your any Phidgets and connections once the program is done.
		await voltageInput0.close();
		await voltageInput1.close();
		await voltageInput2.close();
		await digitalInput0.close();
		await digitalInput1.close();
		await digitalInput2.close();
		conn.close();
		conn.delete();
	}, 5000);
}

runExample();
