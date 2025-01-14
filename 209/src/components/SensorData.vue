<template>
	<div>
		<!-- <h1>Sensor Data</h1> -->
		<VideoPlayer :videoSrc="currentVideo" ref="videoPlayerRef"/>
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
        const currentVideo = ref(sensorStore.getDefaultVideo);
        const videoPlayerRef = ref(null);

        const restartVideo = () => {
            if (videoPlayerRef.value) {
                const player = videoPlayerRef.value.player;
                player.currentTime(0);
                player.play();
                console.log("Video restarted");
            }
        };

		const handlePresenceVideo = (data) => {
			console.log(`Presence state: ${data.state}`);
			if (data.state === true) {
				if (sensorStore.isVideoPlaying) {
					console.log('Video currently playing - trigger blocked');
					return;
				}
				
				sensorStore.setVideoPlaying(true);
				console.log('Video triggered - blocking new triggers');
				
				if (currentVideo.value === "/video/video0.mp4") {
					restartVideo();
				} else {
					currentVideo.value = "/video/video0.mp4";
				}
				console.log(`Playing video: ${currentVideo.value}`);

				setTimeout(() => {
					sensorStore.setVideoPlaying(false);
					console.log("Ready for next video trigger");
				}, sensorStore.VIDEO_DURATION);
			}
		};

        onMounted(() => {
            const socket = io(import.meta.env.VITE_BACKEND_URL);
            socket.on("presenceChange", (data) => {
                handlePresenceVideo(data);
            });
        });

        return {
            currentVideo,
            videoPlayerRef
        };
	},
};
</script>
