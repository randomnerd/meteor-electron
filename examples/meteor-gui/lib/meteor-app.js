require('shelljs/global');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var fs = require('fs');
var request = require('request');
var targz = require('tar.gz');
var tar = require('tar');
var path = require('path');
var ps = require('ps-node');
var dialog = require('dialog');

var config = require('../package.json');

var rootDir = pwd();

var AppPath = rootDir + '/output/myApp';

var tmpPath = rootDir + '/tmp/';
var outputPath = rootDir + '/output/';

var Create = {};
var Download = {};
var Start = {};
var Extract = {};

var meteor, meteorPID, startDir = pwd();


module.exports = {
  appPath: null,
  start: function(splashWindow){
    var self = this;

    if(!which('meteor')){
      console.log('Please install meteor first');
      process.exit(1);
    }

    if(process.env.METEOR_STARTED)
      return console.log('Meteor has already started');

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

    // Send 'meteor-shutdown' message
    // meteor.stdout.on('finish', function(){
    //   splashWindow.webContents.send('stdout');
    // });

    console.log('Meteor PID: %s', meteor.pid);

    meteorPID = meteor.pid;
  },
  stop: function(splashWindow){
    // if(!meteorPID || !process.env.METEOR_STARTED)
    //   return console.log('Meteor was not started!');

    killMeteor();
  },
  chooseFolder: function(splashWindow){
    var self = this;

    // Display dialog
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
  if(process.platform){
    var meteorRegex = /\.meteor/i, nodePID, mongoPID;
    // console.log( 'Meteor has been shutdown!');
    // Kill node && mongod for windows
    
    // Check if node process is related to meteor via arguments

    ps.lookup({ command: 'node' }, function(err, res){
      if(err){
        throw new Error( err );
      }

      // console.log(res);

      res.forEach(function(v){

        v.arguments.forEach(function(args){
          if(meteorRegex.test(args)){
            nodePID = v.pid
            console.log('Node PID %s', nodePID);
          }
        });
      });

      exec('taskkill /F /PID ' + nodePID);
      exec('taskkill /F /PID ' + meteorPID);


      // ps.kill(meteorPID, function(err, res){
      // ps.kill(mongoPID, function(err, res){
      //   if(err){
      //     throw new Error( err );
      //   }
      //   else{
      //     console.log( 'Meteor has been shutdown!');
      //     meteorPID = null;
      //     process.env.METEOR_STARTED = '';
      //   }
      // });
    });

    // ps.lookup({ command: 'mongo' }, function(err, res){
    //   if(err){
    //     throw new Error( err );
    //   }

    //   res.forEach(function(proc){
    //     proc.arguments.forEach(function(args){
    //       if(meteorRegex.test(args)){
    //         mongoPID = proc.pid;
    //         console.log('Mongod PID %s', mongoPID);
    //       }
    //     });
    //   });

    //   exec('taskkill /F /PID ' + mongoPID);

    //   // ps.kill(meteorPID, function(err, res){
    //   // ps.kill(mongoPID, function(err, res){
    //   //   if(err){
    //   //     throw new Error( err );
    //   //   }
    //   //   else{
    //   //     console.log( 'Meteor has been shutdown!');
    //   //     meteorPID = null;
    //   //     process.env.METEOR_STARTED = '';
    //   //   }
    //   // });
    // });
  }
  else{
    /* UNIX FTW */
    ps.kill(meteorPID, function(err, res){
      if(err){
        throw new Error( err );
      }
      else{
        console.log( 'Meteor has been shutdown!');
        meteorPID = null;
        process.env.METEOR_STARTED = '';
      }
    });
  }
}

// Start.mongo = function(){
//   var port = config.mongoPort;
//   console.log('Starting up mongo...');
//   chmod(755, outputPath + 'mongo/bin');

//   /* Set Env Vars*/
//   env.BIND_IP = '127.0.0.1';
//   env.MONGO_URL = 'mongodb=://localhost:27017/myApp';
//   env.ROOT_URL = 'http://localhost:3000';

//   console.log('BIND_IP: %s', process.env.BIND_IP);
//   console.log('MONGO_URL: %s', process.env.MONGO_URL);
//   console.log('ROOT_URL: %s', process.env.ROOT_URL);
//   spawn(outputPath +'mongo/bin/mongod', [/*'--port', port,*/ '--dbpath', outputPath + 'mongoData']).stdout.on('data', function(data){
//     console.log('Mongo has started on port ' + port); 
//     /* Start up meteor app */

//     exec('node build/bundle/main.js').stdout.on('data', function(data){
//       console.log(data);
//     });
//   })
//   .on('error', function(err){
//     console.log(err);
//   });

//   // console.log('Mongod in Path? ' + which('mongod'));
//   // Start.node();
// };

// Start.node = function(){
//   console.log('Starting up node...');
//   exec('node');
// };

// Download.mongo = function(){
//   if(which('mongod'))
//     return;
//   console.log('Downloading mongo...');

//   Extract.mongo();
// };

// Download.node = function(){
//   if(which('node'))
//     return;
//   console.log('How the fuck you running this?');
// };

// Create.folders = function(){
//   // output,tmp, mongoData etc
//   if(!test('-e', outputPath)){
//     console.log('Created output/');
//     mkdir('-p', outputPath);
//   }

//   if(!test('-e', tmpPath)){
//     console.log('Created tmp/');
//     mkdir('-p', tmpPath);
//   }

//   if(!test('-e', outputPath + 'mongoData')){
//     console.log('Created mongoData/');
//     mkdir('-p', outputPath + 'mongoData');
//   }
// };

// Extract.mongo = function(){
//   // Check if it exists
//   if(isFile(outputPath + '/mongo/bin/mongo'))
//     return;
//   console.log('Extracting mongo...');
//   var mongoFile = 'mongodb-linux-x86_64-3.0.2.tgz';

//   var extract = new targz().extract(tmpPath + mongoFile, outputPath + 'tmp', function(err){
//     if(err)
//       console.log(err);
//     console.log('Done extracting mongo');
//     changeMongoName();
//   });
// };

// function changeMongoName(){
//   var fileName = ls(outputPath + 'tmp')[0];
//   if(!fileName)
//     throw error('File not found');

//   mkdir('-p', outputPath + 'mongo');

//   cp('-R', outputPath + 'tmp/' + fileName + '/*', outputPath + 'mongo/');

//   setPath('PATH=' + outputPath + 'mongo/bin:$PATH');

//   rm('-R', outputPath + 'tmp/');
//   Start.mongo();
// }

// function setPath(path){
//   exec('export ' + path);
// }

// function isFile(fileName){
//   return test('-f', fileName);
// }

// function buildMeteor(){
//   if(isBundled())
//     return;
//   console.log('Building your meteor application...');
//   cd(rootDir + AppPath);

//   spawn('meteor', ['build', '../output']).stdout.on('data', function(data){
//     console.log(data);
//   })
//   .on('finish', function(){
//     console.log('Finished with meteor');
//   })
//   .on('error', function(err){
//     console.log(err);
//   });
// }

// function isBundled(){
//   return test('-f', AppPath + '.tar.gz');
// }

// function onErr(err){
//   console.log(err);
// }

// function cleanUp(){
//   rm('-r', tmpPath);
// }