<template>
    <div class="video-container">
        <video
        ref="videoPlayer"
        class="video-js vjs-default-skin"
        controls
        preload="auto"
        >
        <source :src="videoSrc" type="video/mp4" />
        </video>
    </div>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default {
	props: {
		videoSrc: {
			type: String,
			required: true,
		},
	},
	mounted() {
		this.player = videojs(this.$refs.videoPlayer, {
			autoplay: false,
			controls: true,
			preload: "auto",
		});

		console.log("Video player mounted");

		// Deafult video can be set here
		// this.player.src({ type: 'video/webm', src: this.videoSrc });
	},
	beforeUnmount() {
		if (this.player) {
			this.player.dispose();
		}
	},
	watch: {
		videoSrc(newSrc) {
			if (this.player) {
				this.player.src({ type: "video/webm", src: newSrc });
				this.player.play();
			}
		},
	},
};
</script>

<style>
@import "video.js/dist/video-js.css";


.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}

.video-js {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
