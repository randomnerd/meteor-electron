Electron = {}

Electron.configFileName = 'electron.json'
Electron.defaultVersion = '0.31.0'

Electron.path = Npm.require('path')
Electron.shelljs = Npm.require('shelljs')

Electron.getProjectRoot = function () {
  var path = this.path
  var root = process.cwd().split(path.sep)

  // This works as long as the user started the app in project root
  var pathLength = root.length - 5

  // Got root
  root = _.first(root, pathLength) 

  // Convert to string from array
  root = root.join(path.sep)

  return root
}

Electron.defaultOutput = function () {
  return this.path.join(this.getProjectRoot(), '.electron', 'out')
}

Electron.configFile = function () {
  var shelljs = this.shelljs
  var test = shelljs.test
  var cat = shelljs.cat

  var fileName = this.configFileName
  var root = this.getProjectRoot()
  var filePath = this.path.join(root, fileName)

  function getFile () {
    return JSON.parse(cat(filePath))
  }

  // Check that the file exists & return as JSON
  if (test('-f', filePath)) {
    return getFile()
  }

  // Create file
  var settings = this.defaultSettings

  JSON.stringify(settings, null, '\t').to(filePath)

  return getFile()
}

Electron.getSettingValue = function (setting) {
  var file = this.configFile.call(this)

  return file && file[setting]
}

Electron.canStart = function () {
  return this.getSettingValue('runOnStartup')
}

Electron.canPackage = function () {
  return this.getSettingValue('packageApp')
}

Electron.defaultSettings = {
  killMeteorOnExit: true,
  packageApp: false,
  runOnStartup: true,
  appName: "myApp",
  platform: process.platform,
  arch: process.arch,
  version: Electron.defaultVersion,
  all: false,
  out: Electron.defaultOutput(),
  icon: "",
  "app-bundle-id": "",
  "app-version": "",
  cache: "",
  "helper-bundle-id": "",
  ignore: "",
  prune: false,
  overwrite: false,
  asar: false,
  sign: "",
  "version-string": {
    "CompanyName": "",
    "LegalCopyright": "",
    "FileDescription": "",
    "OriginalFilename": "",
    "FileVersion": "",
    "ProductVersion": "",
    "ProductName": "",
    "InternalName": ""
  },
}