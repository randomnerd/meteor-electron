Electron.Folders = {
  hasFolder: function (folder) {
    if (!folder) {
      folder = ''
    }

    var folder = Electron.path.join(Electron.getProjectRoot(), '.electron', folder)

    return Electron.shelljs.test('-d', folder)
  },
  createFolder: function (folder) {
    if (!folder) {
      folder = ''
    }

    var folder = Electron.path.join(Electron.getProjectRoot(), '.electron', folder)
    Electron.shelljs.mkdir('-p', folder)
  }
}

Electron.Folders.hasElectron = function () {
  return this.hasFolder('.electron')
}

Electron.Folders.createElectron = function () {
  this.createFolder('')
}

Electron.Folders.hasApp = function () {
  return this.hasFolder('app')
}

Electron.Folders.createApp = function () {
  this.createFolder('app')
}

Electron.Folders.hasOutput = function () {
  return this.hasFolder('out')
}

Electron.Folders.createOutput = function () {
  this.createFolder('out')
}
