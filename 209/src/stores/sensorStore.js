import { defineStore } from "pinia";

export const useSensorStore = defineStore("sensor", {
	state: () => ({
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
		VIDEO_DURATION: 30000,
		isVideoPlaying: false,
		defaultVideo: "/video/video0.mp4"
	}),
	actions: {
        setVideoPlaying(state) {
            this.isVideoPlaying = state;
        },
        getVideoDuration() {
            return this.VIDEO_DURATION;
        }
    },
	getters: {
        getDefaultVideo: (state) => state.defaultVideo
    }
});
