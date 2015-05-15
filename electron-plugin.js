Npm.require('shelljs/global');
var path = Npm.require('path');
var packagePath = Npm.require('meteor-package-path');
setElectronPath();

var fs = Npm.require('fs');
var request = Npm.require('request');
var electron = Npm.require('electron-prebuilt');
var args = Npm.require('minimist')(process.argv.slice(2), {boolean: ['prune', 'asar']});
var electronPackager = Npm.require('electron-packager');


Electron = (function(){
  var rootDir, config, electronApp, outputPath, electronVersion, settingsPath;

  /* This file lives in .meteor/local/build/programs/server/packages */
  rootDir = path.resolve('../../../../../');

  // Use '.' as meteor does not monitor these folders for changes
  electronPath = path.join(rootDir, '.electron', '/');
  electronApp = path.join(electronPath, 'electronApp');
  outputPath = path.join(electronPath, 'output');
  settingsPath = path.join(rootDir, 'package.json');

  electronVersion = '0.25.3';
  currentPlatform = process.platform;
  currentArch = process.arch;

  createFoldersFiles();

  electron = stripPathForElectron();

  config = JSON.parse(cat(settingsPath));

  if(!config)
    return console.error('Failed to read electron options in your package.json');

  config = config.electron;


  if(config.packageApp){

    // Don't start Electron just package it
    packageApp();

  }
  else{

    // Run Electron
    startElectron();
  }


  // Create the folder for electron, electron app code, temp path and package.json
  function createFoldersFiles(){
    // Create .electronApp
    if(!test('-e', electronApp))
      mkdir('-p', electronApp);

    // Create .output
    if(!test('-e', outputPath))
      mkdir('-p', outputPath);

    // Create package.json
    if(!test('-f', settingsPath)){
      var settings; 

      settings = '{';

      settings += '\n\t\"electron\" : {';

      settings += '\n\t\t\"packageApp\": false,\n\t\t\"runOnStartup\": true,\n\t\t\"appName\": \"myApp\",';

      settings += '\n\t\t\"platform\": \"' + currentPlatform + '\",\n\t\t\"arch\": \"' + currentArch + '\",';

      settings += '\n\t\t\"version\": \"' + electronVersion + '\"\n';


      settings += '\t}\n';
      settings += '}';

      settings.to(settingsPath);
    }

  };

  function packageApp(){
    
    // Make sure required keys are present in package.json or default to current machine info
    if(!config.appName || !config.platform || !config.arch || !config.version){
      return console.error('Please fill out the required parameters.\nOne or more values in your package.json is broken.');
    }

    var buildPath = config.appName + '-' + config.platform;

    // If packaged app with the same target values already exists in /output do not package again
    if(test('-e', path.join(outputPath, '/', buildPath))){
      return console.error('Your app has already been packaged with those target values.\nIf you wish to package your app again, then please remove the app and start meteor again.');
    }
    
    console.log('Packaging up your app...');

    args.dir = electronApp;
    args.name = config.appName;

    args.platform = config.platform || currentPlatform;
    args.arch = config.arch || currentArch;
    args.version = config.version || electronVersion;

    var protocolSchemes = [].concat(args.protocol || []);
    var protocolNames = [].concat(args['protocol-name'] || []);

    /* From electron-packager cli.js */
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
      cp('-R', buildPath, outputPath);
      rm('-R', buildPath);

      console.log('Moved your app to %s', outputPath);

      startElectron();
    });
  }

  function stripPathForElectron(){
    return electron.replace(/-new-\w+/, '');
  }

  function startElectron(){
    // Do not start if user has specified not to
    if(!config.runOnStartup)
      return;

    // Prevent execution if main.js and/or package.json are not present
    if(!test('-f', path.join(electronApp, 'main.js')) || !test('-f', path.join(electronApp, 'package.json'))){
      echo('Failed to start electron.\nPlease create a main.js and package.json, then put it into .electron/electronApp/ or download it from: \nhttps://github.com/jrudio/meteor-electron/blob/dependency/main.js\nhttps://github.com/jrudio/meteor-electron/blob/dependency/package.json');
      downloadExampleFiles();
      return;
    }

    echo('Starting Electron...');

    electronApp = '\"' + electronApp + '\"';
    electron = '\"' + electron + '\"';

    exec(electron + ' ' + electronApp, { async: true });
  }

  function downloadExampleFiles(){
    function isDone(){
      return test('-f', path.join(electronApp, 'main.js')) && test('-f', path.join(electronApp, 'package.json'));
    }

    var mainJSurl = 'https://raw.githubusercontent.com/jrudio/meteor-electron/dependency/main.js';

    var packageUrl = 'https://raw.githubusercontent.com/jrudio/meteor-electron/dependency/package.json';

    // Do the files exist?
    if(!test('-f', path.join(electronApp, 'main.js'))){
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
        .pipe(fs.createWriteStream(path.join(electronApp, 'main.js')))
        .on('finish', function(){
          echo('Finished downloading main.js');
        });
    }

    if(!test('-f', path.join(electronApp, 'package.json'))){
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
        .pipe(fs.createWriteStream(path.join(electronApp, 'package.json')))
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


function setElectronPath(){
  var startDir = pwd();

  cd(path.join(packagePath, '..', 'electron-prebuilt'));

  // have electron-prebuilt set electron path
  exec('node install.js');

  cd(startDir);
}