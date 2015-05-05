var fs = Npm.require('fs');
var childProcess = Npm.require('child_process');
var unzip = Npm.require('unzip');
var request = Npm.require('request');
var platform = Npm.require('platform');
var config = Npm.require('shelljs').config;

Npm.require('shelljs/global');

config.fatal = true;
/* Figure out where to put static files */
var rootDir = '../../../../../';
var electronPath = rootDir + '.electron';
var electronApp = rootDir + '.electronApp';
var tmpPath = rootDir + '.tmp';

// Check if electron exists
if(!test('-e', electronPath))
  mkdir('-p', electronPath);

// Create Temp dir
if(!test('-e', tmpPath))
  mkdir('-p', tmpPath);

// Create .electronApp
if(!test('-e', electronApp))
  mkdir('-p', electronApp);

var nodeJSversion = '0.12.2';

var windowsRegex = /win/i;

var osPlatform = platform.os.family.toLowerCase();

echo('OS Platform: ' + osPlatform);

var isWindows = windowsRegex.test(osPlatform);

var machineType = platform.os.architecture;

var osArch = osPlatform, arch;

if(machineType === 64){
  osArch += '-x64';
}
else{
  osArch += '-ia32';
}

var electronVersion = '0.25.2';
var electronUrl = 'https://github.com/atom/electron/releases/download/v';
var electronFile = 'electron-v' + electronVersion + '-' + osArch + '.zip';

// If not in tmp and it is not extracted
if(!test('-f', tmpPath + '/' + electronFile) && !test('-f', electronPath + '/electron')){
  echo('Attemping to download electron...');
  downloadAndExtractElectron();
}
// You have the zip but it's not extracted
else if(test('-f', electronFile) && !test('-f', electronPath)){
  echo('Extracting electron...');
  extractElectron();
}
else{
  echo('Hooray you have it!');
  downloadExampleFiles();
  startElectron();
}

function deleteTmp(){
  if(test('-e', tmpPath))
    rm('-r', tmpPath);
}

function startElectron(){
  // Prevent execution if main.js and/or package.json are not present
  if(!test('-f', electronApp + '/main.js')){
    return echo('Failed to start electron.\nPlease create a main.js and put it into .electronApp/ or download from: \nhttps://github.com/jrudio/meteor-electron/blob/master/main.js');
  }

  if(!test('-f', electronApp + '/package.json')){
    return echo('Failed to start electron.\nPlease create a package.json and put it into .electronApp/ or download from: \nhttps://github.com/jrudio/meteor-electron/blob/master/package.json');
  }

  echo('Starting Electron...');
  echo('Current dir: ' + ls(electronApp + '/'));

  chmod(755, electronPath + '/electron');
  chmod(755, electronApp + '/');
  exec(electronPath + '/electron ' + electronApp + '/', {async: true});
}

function extractElectron(){
  // Extract contents to electron/
  echo('Extracting electron...');
  fs.createReadStream(tmpPath + '/' + electronFile).pipe(unzip.Extract({ path: electronPath + '/' }))
    .on('finish', function(){
      echo('Finished extracting file to /.electron');
      downloadExampleFiles();
      startElectron();
      deleteTmp();
    });
}

function downloadAndExtractElectron(){
  request.get(electronUrl + electronVersion + '/' + electronFile)
    .on('response', function(response) {
      if(response.statusCode === 200 ){
        console.log('Downloading electron...');
      }
      else{
        console.error('Something went wrong downloading electron. \nExiting...');
        process.exit(1);
      }
    })
    .pipe(fs.createWriteStream(tmpPath + '/' + electronFile))
    .on('finish', extractElectron);
}

function downloadExampleFiles(){
  var mainJSurl = 'https://raw.githubusercontent.com/jrudio/meteor-electron/master/main.js';

  var packageUrl = 'https://raw.githubusercontent.com/jrudio/meteor-electron/master/package.json';

  // Do the files exist?
  if(!test('-f', electronApp + '/main.js')){
    request.get(mainJSurl)
      .on('response', function(response){
        if(response.statusCode === 200 ){
          console.log('Downloading main.js ...');
        }
        else{
          console.error('Something went wrong downloading main.js. Please create your own main.js and put it into .electronApp/ \nExiting...');
          process.exit(1);
        }
      })
      .pipe(fs.createWriteStream(electronApp + '/main.js'))
      .on('finish', function(){
        echo('Finished downloading main.js');
        startElectron();
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
          console.error('Something went wrong downloading package.json. Please create your own package.json and put it into .electronApp/ \nExiting...');
          process.exit(1);
        }
      })
      .pipe(fs.createWriteStream(electronApp + '/package.json'))
      .on('finish', function(){
        echo('Finished downloading package.json');
      });
  }
}