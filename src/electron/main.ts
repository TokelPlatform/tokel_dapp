/* eslint global-require: off, no-console: off */

import path from 'path';
import { Worker } from 'worker_threads';

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { BrowserWindow, app, ipcMain, shell } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { BitgoAction, checkData } from '../util/bitgoHelper';
import { BITGO_IPC_ID, IPFS_IPC_ID, VERSIONS_MSG, WindowControl } from '../vars/defines';
import MenuBuilder from './menu';
import packagejson from './package.json';

const ipfsNode = require('./ipfsHelper');

// loading BitGo and Wasm Cryptoconditions in a separate process
const workerPath = path.join(app.getAppPath(), 'worker.js');
const bitgoWorker = new Worker(workerPath);
bitgoWorker.postMessage({ type: BitgoAction.RECONNECT });
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    // temporary so it does not pollute the logs
    // autoUpdater.checkForUpdatesAndNotify();
  }
}

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const version = isDev ? packagejson.version : app.getVersion();

let mainWindow: BrowserWindow | null = null;

if (isProd) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDev || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const installExtensions = async () => {
  await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
    loadExtensionOptions: { allowFileAccess: true },
    forceDownload: false,
  });
};

// bitgo events from renderer
ipcMain.on(BITGO_IPC_ID, (_, msg) => {
  if (isDev) {
    console.group('BITGO (RENDERER -> [MAIN] -> WORKER)');
    console.log(checkData(msg));
    console.groupEnd();
  }
  bitgoWorker.postMessage(msg);
});

// ipfs events from renderer
ipcMain.on(IPFS_IPC_ID, async (event, msg) => {
  console.group('IPFS (RENDERER -> [MAIN])');
  console.log(msg);
  console.groupEnd();
  const result = await ipfsNode.default[msg.type](msg.payload);
  event.reply(IPFS_IPC_ID, { type: msg.type, payload: result });
});

ipcMain.on(VERSIONS_MSG, (event, msg) => {
  event.reply(VERSIONS_MSG, { version });
});

// window events from renderer
ipcMain.on('window-controls', async (_, arg) => {
  if (mainWindow) {
    if (arg === WindowControl.MIN) {
      mainWindow.minimize();
    } else if (arg === WindowControl.MAX) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    } else if (arg === WindowControl.CLOSE) {
      mainWindow.close();
    }
  }
});

const createWindow = async () => {
  if (isDev || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const resolveAsset = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1240,
    height: 720,
    minHeight: 420,
    center: true,
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 18, y: 26 },
    backgroundColor: '#222c3c',
    resizable: true,
    icon: resolveAsset('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      // production debug
      // mainWindow.webContents.openDevTools();
      mainWindow.focus();
    }
  });

  // pass messages to renderer from bitgo worker
  bitgoWorker.on('message', msg => {
    if (isDev) {
      console.group('BITGO (WORKER -> [MAIN] -> RENDERER)');
      console.log(checkData(msg));
      console.groupEnd();
    }
    mainWindow.webContents.send(BITGO_IPC_ID, msg);
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // eslint-disable-next-line no-new
  // new AppUpdater();
};

// Autoupdate handlers
ipcMain.on('update-check', () => {
  if (isDev) {
    autoUpdater.checkForUpdates();
  } else {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

ipcMain.on('update-restart', () => {
  autoUpdater.quitAndInstall();
  setTimeout(() => {
    app.relaunch();
    app.exit();
  }, 5000);
});

autoUpdater.on('error', data => {
  mainWindow?.webContents.send('update-error', data);
});

autoUpdater.on('update-not-available', data => {
  mainWindow?.webContents.send('update-not-available', data);
});

autoUpdater.on('update-available', data => {
  mainWindow?.webContents.send('update-available', data);
});

autoUpdater.on('download-progress', data => {
  mainWindow?.webContents.send('download-progress', data);
});

autoUpdater.on('update-downloaded', data => {
  mainWindow?.webContents.send('update-downloaded', data);
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

app.whenReady().then(createWindow).catch(console.log);
