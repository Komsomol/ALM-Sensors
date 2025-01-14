let currentVideoIndex = -1; // -1 means idle video is playing
const idleVideo = document.getElementById('idle-video');
const videos = Array.from(document.querySelectorAll('video:not(#idle-video)'));

// Add event listeners for video end
videos.forEach((video) => {
	video.addEventListener('ended', () => {
		showVideo(-1); // Return to idle video
	});
});

function showVideo(index) {
	// Pause all videos first
	videos.forEach((v) => {
		v.classList.remove('active');
		v.pause();
		v.currentTime = 0;
	});

	if (index >= 0) {
		// Show selected video
		videos[index].classList.add('active');
		videos[index].play();
		idleVideo.pause();
		currentVideoIndex = index;
	} else {
		// Show idle video
		idleVideo.play();
		currentVideoIndex = -1;
	}
}

document.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'ArrowLeft':
			currentVideoIndex =
				(currentVideoIndex - 1 + videos.length) % videos.length;
			showVideo(currentVideoIndex);
			break;
		case 'ArrowRight':
			currentVideoIndex = (currentVideoIndex + 1) % videos.length;
			showVideo(currentVideoIndex);
			break;
		// case ' ':
		// 	const activeVideo =
		// 		document.querySelector('video.active') || idleVideo;
		// 	if (activeVideo.paused) activeVideo.play();
		// 	else activeVideo.pause();
		// 	break;
	}
});

// Start with idle video
showVideo(-1);
