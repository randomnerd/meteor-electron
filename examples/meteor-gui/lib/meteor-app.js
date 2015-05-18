require('shelljs/global');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var path = require('path');
var ps = require('ps-node');
var kill = require('tree-kill');
var dialog = require('dialog');

var config = require('../package.json');

var rootDir, AppPath, tmpPath, outputPath;

rootDir = pwd();
AppPath = path.join(rootDir, 'output', 'myApp');
tmpPath = path.join(rootDir, 'tmp');
outputPath = path.join(rootDir, 'output');

var meteor, meteorPID;


module.exports = {
  appPath: null,
  start: function(splashWindow){
    var self = this;

    if(!which('meteor')){
      console.log('Please install meteor first');
      process.exit(1);
    }

    // Check if started -- I need a sure way that it is started
    if(process.env.METEOR_STARTED)
      return console.log('Meteor has already started');

    // Choose a project
    if(!self.appPath)
      return console.log('Please select a meteor project');

    cd(self.appPath);

    meteor = exec('meteor');

    meteor.stderr.on('error', function(data){
      console.log(data.toString());
    });

    var starting = process.env.METEOR_STARTED ? false : true;

    meteor.stdout.on('data', function(data){
      data = data.toString();
      
      if(/app running at/ig.test(data)){
        /* Open Meteor project here */
        process.env.METEOR_STARTED = true;
      }

      splashWindow.webContents.send('stdout', data, starting);
    });

    meteor.stdout.on('finish', function(){
      console.log('Meteor has stopped');
    });

    console.log('Meteor PID: %s', meteor.pid);

    meteorPID = meteor.pid;
  },
  stop: function(splashWindow){
    if(!meteorPID || !process.env.METEOR_STARTED)
      return console.log('Meteor was not started!');

    killMeteor();
  },
  chooseFolder: function(splashWindow){
    var self = this;

    // Get Meteor app path
    dialog.showOpenDialog(splashWindow, {
      title: 'Please select a Meteor project directory',
      defaultPath: function(){
        return pwd();
      },
      properties: ['openDirectory']
    }, function(appPath){
      if(!appPath)
        return console.log('No application selected');

      console.log(appPath);

      // Set meteor app path
      self.appPath = appPath.length > 0 ? appPath[0] : null;
    });
  }
};

function killMeteor(){  
  kill(meteor.pid, 'SIGKILL', function(err){
    if(err)
      throw Error(err);
    else
      process.env.METEOR_STARTED = '';
  });
}