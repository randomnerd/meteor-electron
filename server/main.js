// Controls the flow of this package
if (!Electron.Folders.hasElectron()) {
  Electron.Folders.createElectron()
}

if (!Electron.Folders.hasApp()) {
  Electron.Folders.createApp()
}

if (!Electron.Folders.hasOutput()) {
  Electron.Folders.createOutput()
}

if (Electron.canStart()) {
  Electron.startApp()
}

if (Electron.canPackage()) {
  Electron.packageApp()
}
