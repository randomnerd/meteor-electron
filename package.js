Package.describe({
  name: 'jrudio:electron',
  version: '0.1.0',
  summary: 'Run your Meteor app in Electron',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jrudio/meteor-electron',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'meteor-readme.md',
  debugOnly: true
})

Npm.depends({
  'shelljs': '0.4.0',
  'electron-prebuilt': '0.35.0',
  'electron-packager': '5.1.1'
})

Package.onUse(function(api) {
  api.use('underscore')
  api.use('ecmascript')

  api.versionsFrom('1.2.0.1')

  var server = {
    path: 'server',
    files: [],
    add: function (_path) {
      var path = Npm.require('path')

      _path = path.join('server', _path)

      this.files.push(_path)

      return this
    }
  }

  server.add('helpers.js')
  server.add('folder.js')
  server.add('files.js')
  server.add('prebuilt.js')
  server.add('packager.js')
  server.add('main.js')

  api.addFiles(server.files, 'server')
})
