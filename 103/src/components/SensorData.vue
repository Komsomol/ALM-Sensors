<template>
	<div>
		<!-- <h1>Sensor Data</h1> -->
		<VideoPlayer :videoSrc="currentVideo" />
	</div>
</template>

<script>
import { io } from "socket.io-client";
import { useSensorStore } from "../stores/sensorStore";
import { onMounted, ref } from "vue";
import VideoPlayer from "./VideoPlayer.vue";

export default {
	components: {
		VideoPlayer,
	},
	setup() {
		const sensorStore = useSensorStore();
		const currentVideo = ref("");

		// if current_sensor is 0, then its a digital sensor, if its 1, then its an analog sensor
		let current_sensor = 0;

		const handleVideoSwitch = (port, sensor) => {
			console.log(
				`Switching video to port ${port} with sensor ${sensor}`
			);
			if (sensor === 0) {
				console.log(`DIGITAL Switching digital video to port ${port}`);
				const videoSrc = sensorStore.getVideoSrc(port);
				if (videoSrc) {
					currentVideo.value = videoSrc;
				}
			} else {
				// offset the video source by 3
				port = port + 3;
				console.log(`ANALOG Switching analog video to port ${port}`);
				const videoSrc = sensorStore.getVideoSrc(port);
				if (videoSrc) {
					currentVideo.value = videoSrc;
				}
			}
		};

		onMounted(() => {
			const socket = io(import.meta.env.VITE_BACKEND_URL);

			socket.on("onDigitalSignal", (data) => {
				current_sensor = 0;
				sensorStore.updateDigitalSensor(data);
				if (data.state) {
					handleVideoSwitch(data.port, current_sensor);
				}
			});

			socket.on("onAnalogSignal", (data) => {
				current_sensor = 1;
				sensorStore.updateAnalogSensor(data);
				if (data.state) {
					handleVideoSwitch(data.port, current_sensor);
				}
			});
		});

		return {
			currentVideo,
		};
	},
};
</script>
