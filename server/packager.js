Electron.packageApp = function () {
  var packager = Npm.require('electron-packager')
  var path = this.path

  var root = this.getProjectRoot()
  var appPath = path.join(root, '.electron', 'app')

  var settings = this.configFile.call(this)
  var out = settings.out
  var arch = settings.arch
  var version = settings.version
  var name = settings.appName
  var platform = settings.platform
  var out = settings.out

  // Required arguments
  var packagerOptions = {
    dir: appPath,
    name: name,
    platform: platform,
    arch: arch,
    version: version
  }

  // Override any undefined properties
  _.defaults(packagerOptions, {
    name: 'myApp',
    platform: process.platform,
    arch: process.arch,
    version: this.defaultVersion
  })

  // Set the optional args if present
  if (settings.all) {
    _.extend(packagerOptions, {all: settings.all})
  }

  if (settings.out) {
    _.extend(packagerOptions, {out: settings.out})
  } else {
    var output = path.join(root, '.electron', 'out')
    _.extend(packagerOptions, {out: output})
  }

  if (settings.icon) {
    _.extend(packagerOptions, {icon: settings.icon})
  }

  if (settings['app-bundle-id']) {
    _.extend(packagerOptions, {'app-bundle-id': settings['app-bundle-id']})
  }

  if (settings['app-version']) {
    _.extend(packagerOptions, {'app-version': settings['app-version']})
  }

  if (settings.cache) {
    _.extend(packagerOptions, {cache: settings.cache})
  }

  if (settings['helper-bundle-id']) {
    _.extend(packagerOptions, {'helper-bundle-id': settings['helper-bundle-id']})
  }

  if (settings.ignore) {
    _.extend(packagerOptions, {ignore: settings.ignore})
  }

  if (settings.prune) {
    _.extend(packagerOptions, {prune: settings.prune})
  }

  if (settings.overwrite) {
    _.extend(packagerOptions, {overwrite: settings.overwrite})
  }

  if (settings.asar) {
    _.extend(packagerOptions, {asar: settings.asar})
  }

  if (settings.sign) {
    _.extend(packagerOptions, {sign: settings.sign})
  }

  // if (settings['version-string'].CompanyName) {
  //   packagerOptions['version-string'].CompanyName = settings['version-string'].CompanyName
  // }

  startPackaging(packagerOptions)


  function startPackaging (opts) {
    packager(opts, function (err, appPath) {
      if (appPath.length >= 0) {
        console.log('Your app has been packaged to ' + appPath[0])
      } else {
        console.log(err)
      }
    })
  }
}
