var fs = Npm.require('fs');
var request = Npm.require('request');
var electron = Npm.require('electron-prebuilt');
var args = Npm.require('minimist')(process.argv.slice(2), {boolean: ['prune', 'asar']});
var electronPackager = Npm.require('electron-packager');

Npm.require('shelljs/global');

Electron = (function(){
  var rootDir, config, electronApp, outputPath, isWindows;

  isWindows = process.platform === 'win32' ? true : false;

  /* This file lives in .meteor/local/build/programs/server/packages */
  rootDir = isWindows ? '..\\..\\..\\..\\..\\' : '../../../../../';

  // Use '.' as meteor does not monitor these folders for changes
  electronPath = rootDir + '.electron/';
  electronApp = electronPath + 'electronApp';
  outputPath = electronPath + 'output';

  createFoldersFiles();

  electron = stripPathForElectron();

  config = JSON.parse(cat(rootDir + 'package.json'));

  if(config.package){
    // Don't start Electron just package
    packageApp();
  }
  else{
    // Run Electron
    startElectron();
  }


  /* Functions */

  // Create the folder for electron, electron app code, temp path and package.json
  function createFoldersFiles(){
    // Create .electronApp
    if(!test('-e', electronApp))
      mkdir('-p', electronApp);

    // Create .output
    if(!test('-e', outputPath))
      mkdir('-p', outputPath);

    // Create package.json
    if(!test('-f', rootDir + 'package.json'))
      '{\n\t\"package\": false,\n\t\"runOnStartup\": true,\n\t\"appName\": \"myApp\"\n}'.to(rootDir + 'package.json');
  };

  function packageApp(){
    if(isWindows){
      return console.error('Windows is currently not supported by electron-packager');
    }

    // Check if packaged app already exists

    if(ls(outputPath).length > 0){
      return console.error('Please remove your app from .electron/output/dist/ \nThen, restart meteor, if you wish to package your app again.');
    }

    console.log('Packaging up your app...');

    args.dir = electronApp;
    args.name = config.appName;

    if(!config.appName){
      return console.error('Please define an appName in package.json');
    }

    var protocolSchemes = [].concat(args.protocol || []);
    var protocolNames = [].concat(args['protocol-name'] || []);

    if (protocolSchemes && protocolNames && protocolNames.length === protocolSchemes.length) {
      args.protocols = protocolSchemes.map(function (scheme, i) {
        return { schemes: [scheme], name: protocolNames[i] };
      });
    }

    electronPackager(args, function(error, appPath){
      if(error){
        return console.error(error);
      }

      // Move to outputPath
      mv('dist/*', outputPath);

      // Delete dist/
      rm('-r', 'dist/*');

      console.log('Moving your app to .electron/outputPath');
    });
  }

  function stripPathForElectron(){
    var pathRegex = isWindows ? /-new-\w+(?=\\)/ : /-new-\w+(?=\/)/;

    return electron.replace(pathRegex, '');
  }


  function startElectron(){
    // Do not start if user has specified not to
    if(!config.runOnStartup)
      return;

    // Prevent execution if main.js and/or package.json are not present
    if(!test('-f', electronApp + '/main.js') || !test('-f', electronApp + '/package.json')){
      echo('Failed to start electron.\nPlease create a main.js and package.json, then put it into .electronApp/ or download it from: \nhttps://github.com/jrudio/meteor-electron/blob/dependency/main.js\nhttps://github.com/jrudio/meteor-electron/blob/dependency/package.json');
      downloadExampleFiles();
      return;
    }

    echo('Starting Electron...');

    exec(electron + ' ' + electronApp, { async: true });
  }

  function downloadExampleFiles(){
    function isDone(){
      return test('-f', electronApp + '/main.js') && test('-f', electronApp + '/package.json');
    }

    var mainJSurl = 'https://raw.githubusercontent.com/jrudio/meteor-electron/dependency/main.js';

    var packageUrl = 'https://raw.githubusercontent.com/jrudio/meteor-electron/dependency/package.json';

    // Do the files exist?
    if(!test('-f', electronApp + '/main.js')){
      request.get(mainJSurl)
        .on('response', function(response){
          if(response.statusCode === 200 ){
            console.log('Downloading main.js ...');
          }
          else{
            console.error('Something went wrong downloading main.js. Please create your own main.js and put it into .Electron.electronApp/ \nExiting...');
            return;
          }
        })
        .pipe(fs.createWriteStream(electronApp + '/main.js'))
        .on('finish', function(){
          echo('Finished downloading main.js');
        });
    }

    if(!test('-f', electronApp + '/package.json')){
      echo('Downloading package.json...');
      request.get(packageUrl)
        .on('response', function(response){
          if(response.statusCode === 200 ){
            console.log('Downloading package.json ...');
          }
          else{
            console.error('Something went wrong downloading package.json. Please create your own package.json and put it into .Electron.electronApp/ \nExiting...');
            return;
          }
        })
        .pipe(fs.createWriteStream(electronApp + '/package.json'))
        .on('finish', function(){
          echo('Finished downloading package.json');
        });
    }

    // Start Electron when both files are done downloading
    var poll = setInterval(function(){
      if(isDone()){
        startElectron();
        clearInterval(poll);
      }
    }, 2000);
  }

  /* Expose for testing */
  return {
    rootDir: rootDir,
    electronApp: electronApp,
    electronPath: electronPath,
    outputPath: outputPath,
    config: config,
    outputPath: outputPath,
    createFoldersFiles: createFoldersFiles
  };
})();