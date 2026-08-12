const { app, BrowserWindow, clipboard, dialog, globalShortcut, ipcMain, Menu, nativeImage, Notification, screen, Tray } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');

let widget;
let tray;

function createWidget() {
  widget = new BrowserWindow({
    width: 430,
    height: 180,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: { contextIsolation: true, preload: path.join(__dirname, 'preload.js') }
  });
  widget.loadFile(path.join(__dirname, 'widget.html'));
  widget.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      widget.hide();
    }
  });
}

function storePath() {
  return path.join(app.getPath('userData'), 'items.json');
}

function saveItem(item) {
  const file = storePath();
  let items = [];
  try { items = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  items.unshift({ ...item, id: Date.now(), createdAt: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(items, null, 2));
}

function toggleWidget() {
  if (!widget) createWidget();
  if (widget.isVisible()) return widget.hide();
  const point = screen.getCursorScreenPoint();
  widget.setPosition(Math.max(10, point.x - 215), Math.max(10, point.y - 90));
  widget.show();
}

function positionWidget() {
  const area = screen.getPrimaryDisplay().workArea;
  widget.setPosition(area.x + area.width - 450, area.y + area.height - 205);
}

app.whenReady().then(() => {
  createWidget();
  app.setLoginItemSettings({ openAtLogin: true });
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '..', 'assets', 'linkflow.ico')));
  tray.setToolTip('LinkFlow');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Quick Capture', click: toggleWidget },
    { label: 'Show LinkFlow Widget', click: () => { positionWidget(); widget.show(); } },
    { label: 'Hide LinkFlow Widget', click: () => widget.hide() },
    { label: 'Upcoming Meetings', click: () => new Notification({ title: 'LinkFlow', body: 'No upcoming meetings.' }).show() },
    { type: 'separator' },
    { label: 'Quit LinkFlow', click: () => app.quit() }
  ]));
  positionWidget();
  widget.show();
  globalShortcut.register('CommandOrControl+Shift+L', toggleWidget);
  if (app.isPackaged) autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-downloaded', () => {
  new Notification({ title: 'LinkFlow updated', body: 'Restart LinkFlow to install the latest version.' }).show();
});

ipcMain.handle('capture-item', (_event, item) => {
  saveItem(item);
  new Notification({ title: 'Saved to LinkFlow', body: item.name || item.value || 'Item captured' }).show();
  return { ok: true };
});

ipcMain.handle('choose-file', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('read-clipboard', () => ({ text: clipboard.readText() }));

app.on('before-quit', () => { app.isQuitting = true; });
app.on('will-quit', () => globalShortcut.unregisterAll());
