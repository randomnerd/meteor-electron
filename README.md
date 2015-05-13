#Electron for Meteor

#####Install

    meteor add jrudio:electron
    
This Meteor package starts when meteor starts up, useful for developing your app for electron.

[Here is a demo of Electron in use with meteor](https://www.youtube.com/watch?v=1OpsJp1_OK4)

#How it works

###Running Electron
1.	When meteor starts up, it will create 1 folder in the root of your app and 2 sub-folders:

		/.electron	         =>   Electron is downloaded here
		  -  /electronApp	   =>   Your Electron-specific code goes here
		  -  /output 		     =>   Your app will be sent here when you package it
2.	It will proceed to download the boilerplate main.js & package.json needed for Electron
3.	Creates a package.json in the root if one is not present
4.	Runs Electron

###Packaging Your App For Electron

1.  In your package.json set 

    "packageApp": true

2.  Fill out your target platform

    "platform": "linux"

3.  Fill out the target architecture

    "arch": "x64"

4.  Set the version of Electron you want it packaged up with(Defaults to 0.25.3)

    "version": "0.25.3"

5.  Start up meteor

6. Wait for a message saying "Moved your app to .electron/output/<appName-platform>"


These are the currently available options in your package.json


    {
      //  Default Values
      "packageApp": true,           =>    Package your app and outputs to .electron/output/
      "runOnStartup": false,        =>    Starts Electron with your app
      "appName": "myApp"            =>    The name of your executable (myApp.exe)*
      "platform": "win32"           =>    Target platform. Defaults to current machine platform you are on [darwin, linux, or win32]*
      "arch": "ia32"               =>    Target architecture. Defaults to current machine architecure you are on [ia32, x64]*
      "version": "0.25.3"            =>    Version of electron you want packaged up (Default 0.25.3)*
    }

*Required values for packaging your app

###Notes

*	This has not been tested on Mac, so at this time it may not work.
*	I have only tested this on Linux(Ubuntu 15.04) & Windows 8.1
*	This package does not get compiled when you build your meteor application for production, so do not have to worry about removing the package beforehand.
* You cannot run your packaged app as a standalone app at this time, it just points to http://localhost:3000/ (I plan on integrating that).

######Credit
Shoutout to sircharleswatson and the resources he used! He started the electrometeor boilerplate. I pretty much used his idea and expanded upon it for a package.

=======
#History

###v0.0.7

Fixed path issues on windows by using npm module path. Also, tweaked how Electron is started as paths that contain spaces broke everything

###v0.0.6

Updated Electron-packager to 4.0.2 (Windows support). Extra parameters are required.

###v0.0.5

Utilizes electron-prebuilt(instead of using a zipped up version) & electron-packager. On Linux & OSX you can package your app, if you try while on Windows it will display an error
	  
	  
![Imgur](http://i.imgur.com/7jnPWgS.png?1 "Running Electron on Plex Requests")
