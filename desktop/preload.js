const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('linkflow', {
  capture: (payload) => ipcRenderer.invoke('capture-item', payload),
  chooseFile: () => ipcRenderer.invoke('choose-file'),
  readClipboard: () => ipcRenderer.invoke('read-clipboard')
});
