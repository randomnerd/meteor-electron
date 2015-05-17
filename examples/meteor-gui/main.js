var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var childProcess = require('child_process');
var meteor = require('./lib/meteor-app.js');

var Menu = require('menu');

var menuTemplate = [
  {
    label: 'Electron',
    submenu: [
      {
        label: 'About Electron',
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Electron',
      },
      {
        label: 'Hide Others',
      },
      {
        label: 'Show All',
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        click: function() { app.quit(); }
      },
    ]
  },
  {
    label: 'Meteor',
    submenu: [
      {
        label: 'Choose Meteor Project',
        click: function(){
          meteor.chooseFolder(global.splashWindow);
        }
      },
      {
        label: 'start',
        click: function(){
          meteor.start(global.splashWindow);
        }
      },
      {
        label: 'stop',
        click: function(){
          meteor.stop(global.splashWindow);
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
      },
      {
        label: 'Toggle DevTools',
        click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
      },
    ]
  }
];

process.env.METEOR_STARTED = '';

var timer;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});


// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  var menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  global.splashWindow = new BrowserWindow({width: 370, height: 200});


  global.splashWindow.loadUrl('file://' + __dirname + '/splash.html');

  global.splashWindow.on('closed', function(){
    global.splashWindow = null;
  });

  // Initial check
  global.splashWindow.send('meteor-has-started', process.env.METEOR_STARTED);

  setInterval(function(){
    // console.log('Meteor started env: %s \n', process.env.METEOR_STARTED);
    console.log('MeteorAppPath: %s', meteor.appPath);
    global.splashWindow.send('meteor-has-started', process.env.METEOR_STARTED);
  }, 900);
});