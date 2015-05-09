var fs = Npm.require('fs');
var unzip = Npm.require('unzip');
var request = Npm.require('request');
var platform = Npm.require('platform');

Npm.require('shelljs/global');

Electron = (function(){
  var rootDir, windowsRegex, electronConfig, osPlatform, isWindows;

  /* Figure out where to put static files */
  rootDir = '../../../../../';
  windowsRegex = /win/i;

  osPlatform = platform.os.family.toLowerCase();
  isWindows = windowsRegex.test(osPlatform);

  setElectronType();

  var electronPath, electronApp, tmpPath, machineType, osArch;

  // Use '.' as meteor does not monitor these folders for changes
  electronPath = rootDir + '.electron';
  electronApp = rootDir + '.electronApp';
  tmpPath = rootDir + '.tmp';

  createFoldersFiles();

  electronConfig = JSON.parse(cat(rootDir + 'package.json'));


  echo('OS Platform: ' + osPlatform);


  machineType = platform.os.architecture;

  osArch = osPlatform;

  if(machineType === 64){
    osArch += '-x64';
  }
  else{
    osArch += '-ia32';
  }

  var electronVersion, electronUrl, electronFile;

  electronVersion = '0.25.2';
  electronUrl = 'https://github.com/atom/electron/releases/download/v';
  electronFile = 'electron-v' + electronVersion + '-' + osArch + '.zip';

  checkElectronStatus();

  /* Functions */


  // Flip slashes for windows
  function setElectronType(){
    if(isWindows){
      rootDir = rootDir.replace(/\//g, '\\');
      electronType = 'electron.exe';
    }
    else if(isOSX){
      electronType = 'Electron.app/Contents/MacOS/Electron';
    }
    else{
      // Linux
      electronType = 'electron';
    }
  };

  // Create the folder for electron, electron app code, temp path and package.json
  function createFoldersFiles(){
    // Check if electron exists
    if(!test('-e', electronPath))
      mkdir('-p', electronPath);
    // Create Temp dir
    if(!test('-e', tmpPath))
      mkdir('-p', tmpPath);

    // Create .electronApp
    if(!test('-e', electronApp))
      mkdir('-p', electronApp);

    // Create package.json
    if(!test('-f', rootDir + 'package.json'))
      '{\n\t\"compile": false,\n\t\"runOnStartup\": true\n}'.to(rootDir + 'package.json');
  };

  function checkElectronStatus(){
    // If not in tmp and it is not extracted
    if(!test('-f', tmpPath + '/' + electronFile) && !test('-f', electronPath + '/' + electronType)){
      echo('Attemping to download electron...');
      downloadAndExtract();
    }
    // You have the zip but it's not extracted
    else if(test('-f', tmpPath + '/' + electronFile) && !test('-f', electronPath + '/' + electronType)){
      echo('Extracting electron...');
      extractElectron();
    }

    if(test('-f', electronPath + '/' + electronType)){
      echo('Hooray you have Electron downloaded and extracted!');
      startElectron();
    }
  }

  function startElectron(){
  	var config = electronConfig;
    // Do not start if user has specified
    if(!config.runOnStartup)
      return;

    // Prevent execution if main.js and/or package.json are not present
    if(!test('-f', electronApp + '/main.js')){
      echo('Failed to start electron.\nPlease create a main.js and put it into .electronApp/ or download it from: \nhttps://github.com/jrudio/meteor-electron/blob/master/main.js');
      return;
    }

    if(!test('-f', electronApp + '/package.json')){
      echo('Failed to start electron.\nPlease create a package.json and put it into .electronApp/ or download it from: \nhttps://github.com/jrudio/meteor-electron/blob/master/package.json');
      return;
    }

    echo('Starting Electron...');

    if(isWindows){
      chmod(755, electronPath + '\\' + electronType);
      chmod(755, electronApp + '\\');
      exec(electronPath + '\\' + electronType + ' ' + electronApp + '/', {async: true});
    }
    else{
      chmod(755, electronPath + '/' + electronType);
      chmod(755, electronApp + '/');
      exec(electronPath + '/' + electronType + ' ' + electronApp + '/', {async: true});
    }
  }

  function cleanup(){
    if(test('-e', tmpPath))
      rm('-r', tmpPath);
  }

  function extractElectron(){
    // Extract contents to electron/
    echo('Extracting electron...');

    fs.createReadStream(tmpPath + '/' + electronFile)
    .pipe(unzip.Extract({ path: electronPath + '/' }))
      .on('finish', function(){
        echo('Finished extracting electron to /.electron');
        downloadExampleFiles();
        cleanup();
      });
  };

  function downloadAndExtract(){
    request.get(electronUrl + electronVersion + '/' + electronFile)
      .on('response', function(response) {
        if(response.statusCode === 200 ){
          console.log('Downloading electron...');
        }
        else{
          console.error('Something went wrong downloading electron. \nExiting...');
          return;
        }
      })
      .pipe(fs.createWriteStream(tmpPath + '/' + electronFile))
      .on('finish', extractElectron);
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

  /* Expose methods and properties for testing */
  return {
    rootDir: rootDir,
    setElectronType: setElectronType,
    electronType: electronType,
    electronPath: electronPath,
    electronApp: electronApp,
    tmpPath: tmpPath,
    createFoldersFiles: createFoldersFiles,
    cleanup: cleanup
  };
})();