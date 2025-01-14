<template>
	<div class="video-container">
		<video ref="videoPlayer" class="video-js" playsinline>
			<source :src="videoSrc" type="video/mp4" />
		</video>
	</div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

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
			controls: false,
			preload: 'auto',
			playsinline: true,
			muted: false,
			sources: [
				{
					src: this.videoSrc,
					type: 'video/mp4',
				},
			],
		});

		console.log('Video player mounted with source:', this.videoSrc);
	},
	beforeUnmount() {
		if (this.player) {
			this.player.dispose();
		}
	},
	watch: {
		videoSrc(newSrc) {
			if (this.player && newSrc) {
				console.log('New video source detected:', newSrc);
				this.player.src({
					src: newSrc,
					type: 'video/mp4',
				});
			}
		},
	},
};
</script>

<style>
@import 'video.js/dist/video-js.css';

.video-container {
	width: 100vw;
	height: 100vh;
	margin: 0;
	padding: 0;
	overflow: hidden;
	position: fixed;
	top: 0;
	left: 0;
}

.video-js {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* Override video.js default styles
:deep(.vjs-tech) {
  object-fit: cover;
  width: 100%;
  height: 100%;
} */
</style>
