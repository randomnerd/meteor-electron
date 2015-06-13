Package.describe({
  name: 'jrudio:electron',
  version: '0.0.21',
  summary: 'Run your Meteor app in Electron',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jrudio/meteor-electron',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'meteor-readme.md',
  debugOnly: true
});

Npm.depends({
  'shelljs': '0.4.0',
  'electron-prebuilt': '0.27.3',
  'electron-packager': '4.1.2',
  'request': '2.55.0',
  'meteor-package-path': '0.0.1',
  "minimist": "1.1.1"
});

Package.onUse(function(api) {
  var path = Npm.require('path'), client = path.join('lib', 'client'), lib = path.join('lib', 'lib'), server = path.join('lib', 'server');

  api.versionsFrom('1.1.0.2');

  api.use('grigio:babel@0.1.3');
  api.addFiles('electron-plugin.js', 'server');
  api.addFiles(path.join(client, 'env.es6.js'), 'client');
  api.export('Electron');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jrudio:electron');
  api.addFiles('electron-plugin-tests.js', 'server');
});
