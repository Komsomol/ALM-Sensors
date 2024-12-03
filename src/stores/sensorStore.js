import { defineStore } from "pinia";

export const useSensorStore = defineStore("sensor", {
	state: () => ({
		digitalSensors: [],
		analogSensors: [],
		videoMap: {
			0: "/video/video0.webm",
			1: "/video/video1.webm",
			2: "/video/video2.webm",
			3: "/video/video3.webm",
			4: "/video/video4.webm",
			5: "/video/video5.webm",
		},
	}),
	actions: {
		updateDigitalSensor(data) {
			const index = this.digitalSensors.findIndex(
				(sensor) => sensor.port === data.port
			);
			if (index !== -1) {
				this.digitalSensors[index].state = data.state;
			} else {
				this.digitalSensors.push(data);
			}
		},
		updateAnalogSensor(data) {
			const index = this.analogSensors.findIndex(
				(sensor) => sensor.port === data.port
			);
			if (index !== -1) {
				this.analogSensors[index].state = data.state;
				this.analogSensors[index].voltage = data.voltage;
			} else {
				this.analogSensors.push(data);
			}
		},
	},
	getters: {
		getVideoSrc: (state) => (port) => {
			return state.videoMap[port] || "";
		},
	},
});
