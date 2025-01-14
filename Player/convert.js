const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputDir = process.argv[2] || '.';
const tempDir = path.join(inputDir, 'temp_converted');

// Create temp directory
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

// Get all MP4 files
const videos = fs.readdirSync(inputDir).filter((file) => file.endsWith('.mp4'));

// Convert each video
const convertVideo = (video) => {
	return new Promise((resolve, reject) => {
		const inputPath = path.join(inputDir, video);
		const tempPath = path.join(tempDir, video);

		const command = `ffmpeg -i "${inputPath}" \
			-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
			-pix_fmt yuv420p \
			-c:v libx264 \
			-profile:v baseline \
			-level 3.0 \
			-preset medium \
			-crf 23 \
			-c:a aac \
			-ar 44100 \
			-b:a 128k \
			-movflags +faststart \
			-brand mp42 \
			-metadata compatibility="HTML5 Video Player" \
			-y \
		"${tempPath}"`;

		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(`Error converting ${video}: ${error}`);
				return;
			}
			// Replace original with converted file
			console.log(`✅ Conversion complete for ${video}`);
			console.log(`Replacing original file: ${video}`);
			fs.renameSync(tempPath, inputPath);
			resolve(`Converted ${video}`);
		});
	});
};

// Process all videos and cleanup
Promise.all(videos.map(convertVideo))
	.then((results) => {
		results.forEach((result) => console.log(result));
		fs.rm(tempDir, { recursive: true }, (err) => {
			if (err) throw err;
			console.log(
				'\n🎉 All conversions complete! Temp directory cleaned up.'
			);
		});
	})
	.catch((error) => {
		console.error('\n❌ Error during conversion process:', error);
		process.exit(1);
	});
