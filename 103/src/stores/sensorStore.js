import { defineStore } from "pinia";

export const useSensorStore = defineStore("sensor", {
	state: () => ({
		digitalSensors: [],
		analogSensors: [],
		videoMap: {
			0: "/video/video0.mp4",
			1: "/video/video1.mp4",
			2: "/video/video2.mp4",
			3: "/video/video3.mp4",
			4: "/video/video4.mp4",
			5: "/video/video5.mp4",
			6: "/video/video6.mp4",
			7: "/video/video7.mp4",
			8: "/video/video8.mp4",
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
