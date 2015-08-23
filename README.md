#Electron for Meteor

#####Install

    meteor add jrudio:electron
    
This Meteor package starts when meteor starts up, useful for developing your app for electron.

[Here is a demo of Electron in use with meteor](https://www.youtube.com/watch?v=1OpsJp1_OK4)

#How it works

###Running Electron
1.  When meteor starts up, it will create 1 folder in the root of your app and 2 sub-folders:

    /.electron           =>   Electron is downloaded here
      -  /app            =>   Your Electron-specific code goes here - You can make changes to how your Electron app works
      -  /output         =>   Your app will be sent here when you package it
2.  It will proceed to copy the default main.js & package.json
3.  Creates an electron.json in the root if one is not present
4.  Runs Electron

###Packaging Your App For Electron

1.  In your electron.json set 

    "packageApp": true

2.  Fill out your target platform

    "platform": "linux"

3.  Fill out the target architecture

    "arch": "x64"

4.  Set the version of Electron you want it packaged up with(Defaults to 0.31.0)

    "version": "0.31.0"

5.  Start up meteor

6. Wait for a message saying "Your app has been packaged to .electron/output/<appName-platform>"

Go to the github repo to read the rest of the README


These are the currently available options in your package.json


    {
      //  Default Values
      "packageApp": true,           =>    Package your app and outputs to .electron/output/
      "runOnStartup": false,        =>    Starts Electron with your app
      "appName": "myApp"            =>    The name of your executable (myApp.exe)*
      "platform": "win32"           =>    Target platform. Defaults to current machine platform you are on [darwin, linux, or win32]*
      "arch": "ia32"               =>    Target architecture. Defaults to current machine architecure you are on [ia32, x64]*
      "version": "0.31.0"            =>    Version of electron you want packaged up (Default 0.31.0)*
    }

*Required values for packaging your app

###Notes

*	This has been tested on Mac OS X 10.10.5
*	I have only tested this on Linux(Ubuntu 15.04) & Windows 8.1
*	This package does not get compiled when you build your meteor application for production, so do not have to worry about removing the package beforehand.
* You cannot run your packaged app as a standalone app at this time, it just points to http://localhost:3000/ (I plan on integrating that).

######Credits
Shoutout to sircharleswatson! He started the electrometeor boilerplate. I pretty much used his idea and expanded upon it for a package. 

maxogden [Electron-packager](https://github.com/maxogden/electron-packager)

mafintosh [Electron-prebuilt](https://github.com/mafintosh/electron-prebuilt)

=======
###[History / Changes](history.md)
	  
##Screenshots
![Imgur](http://i.imgur.com/ryEEb21.png "Running a random meteor app on OS X")
![Imgur](http://i.imgur.com/cL3WbTv.jpg "Showing the random meteor app on OS X")
![Imgur](http://i.imgur.com/7jnPWgS.png?1 "Running Electron on Plex Requests")
