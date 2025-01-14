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

		const handleVideoSwitch = (port) => {
            console.log(`Switching video for port ${port}`);
            const videoSrc = sensorStore.getVideoSrc(port);
            if (videoSrc) {
                currentVideo.value = videoSrc;
                console.log(`Playing video: ${videoSrc}`);
            }
        };

        onMounted(() => {
            const socket = io(import.meta.env.VITE_BACKEND_URL);

            socket.on("analogSignal", (data) => {
                console.log(`analog signal detected:`, data);
                if (data.state) {
                    handleVideoSwitch(data.port);
                }
            });
        });

		return {
			currentVideo,
		};
	},
};
</script>
