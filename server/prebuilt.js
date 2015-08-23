Electron.startApp = function () {
  var path = this.path
  var spawn = Npm.require('child_process').spawn
  var electron = Npm.require('electron-prebuilt')
  var shelljs = this.shelljs
  var test = shelljs.test
  var cat = shelljs.cat

  var regex = {
    electron: /-new-\w+(?=\/|\\node_modules)/
  }

  // Need to remove dynamic package naming used by meteor
  electron = electron.replace(regex.electron, '')

  var root = this.getProjectRoot()

  var appPath = path.join(root, '.electron', 'app')
  var electronApp = {
    main: path.join(appPath, 'main.js'),
    packageSettings: path.join(appPath, 'package.json')
  }
  // Check that the two main electron files are present
  if (!test('-f', electronApp.main)) {
    this.Files.main.to(electronApp.main)
  }

  if (!test('-f', electronApp.packageSettings)) {
    var p = JSON.stringify(this.Files.packageSettings)
    p.to(electronApp.packageSettings)
  }

  // Set env vars
  var canKill = this.getSettingValue('killMeteorOnExit') || ''
  var env = _.extend(process.env, {KILL_METEOR_ON_EXIT: canKill})

  var spawnedElectron = spawn(electron, [appPath], {env: env})
}
