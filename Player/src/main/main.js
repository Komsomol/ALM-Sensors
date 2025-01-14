const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Debug mode detection
const isDebug = process.argv.includes('--inspect');
console.log('Debug mode:', isDebug);

let setupWindow = null;
let mainWindow = null;

function createSetupWindow() {
	setupWindow = new BrowserWindow({
		width: 400,
		height: 300,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	setupWindow.loadFile(path.join(__dirname, '../renderer/setup.html'));
}

function createMainWindow(url) {
	mainWindow = new BrowserWindow({
		width: 1920,
		height: 1080,
		fullscreen: !isDebug,
		kiosk: !isDebug,
		autoHideMenuBar: !isDebug,
		webPreferences: {
			webviewTag: true,
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(createSetupWindow);

ipcMain.on('start-kiosk', (event, url) => {
	createMainWindow(url);
	setupWindow.close();
});

ipcMain.on('stand-alone', () => {
	const playerWindow = new BrowserWindow({
		width: 1920,
		height: 1080,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		resizable: false,
		useContentSize: true,
	});

	playerWindow.loadFile('src/renderer/video-player/index.html');
});
