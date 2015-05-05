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
  mkdir('-p', rootDir + '.electron');

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
if(!test('-f', tmpPath + '/' + electronFile) && !test('-f', electronPath)){
  echo('Attemping to download electron...');
  downloadAndExtractElectron()
}
// You have the zip but it's not extracted
else if(test('-f', electronFile) && !test('-f', '.electron/electron')){
  echo('Extracting electron...');
  extractElectron();
}
else{
  echo('Hooray you have it!');
  startElectron();
}

function deleteTmp(){
  if(test('-e', tmpPath))
    rm('-r', tmpPath);
}

function startElectron(){
  echo('Starting Electron...');
  chmod(755, electronPath + '/electron');
  exec(electronPath + '/electron ' + electronApp, {async: true});
}

function extractElectron(){
  // Extract contents to electron/
  echo('Extracting electron...');
  fs.createReadStream(tmpPath + '/' + electronFile).pipe(unzip.Extract({ path: electronPath }))
    .on('finish', function(){
      echo('Finished extracting file to /.electron');

      deleteTmp();
      startElectron();
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
        throw error('Not 200 status code');
      }
    })
    .pipe(fs.createWriteStream(tmpPath + '/' + electronFile))
    .on('finish', extractElectron);
}

function downloadExampleFiles(){

}