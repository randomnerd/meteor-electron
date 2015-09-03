#Meteor-tool extended with desktop support
[Demo of the meteor-tool in action](https://www.youtube.com/watch?v=J6a98VIxgu0)

[Repo](https://github.com/jrudio/meteor)

If you would like to use the meteor command line tool version of this package (No need to add `jrudio:electron`), execute the following in your terminal:

`meteor --release jrudio:METEOR@1.1.0-rc0 add-desktop`

It will take a few minutes to download the tool and initialize files / folders

Then, run it with:

`meteor --release jrudio:METEOR@1.1.0-rc0 run-desktop`

Finally, when you want to build the client:

`meteor --release jrudio:METEOR@1.1.0-rc0 build-desktop`

The options are:

```bash
# Defaults to current machine platform
--platform='linux'
# Defaults to current machine architecture
--targetArch='x64'
# Default
--targetVersion='0.31.1'
# Defaults to MeteorDesktopApp
--name='MyDesktopApp'
```

If you just want to get rid of the desktop files run:

`meteor --release jrudio:METOR@1.1.0-rc0 remove-desktop`

#####Note:
Tested on OS X Yosemite(10.10.5), Ubuntu 15.x, and Windows 10

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
4.	Looks for the `electron` object for the settings
4.	Runs Electron

###Packaging Your App For Electron

######Please refer to [electron-packager's docs](https://github.com/maxogden/electron-packager) for documentation on required and optional arguments


1.  In your settings.json set 

    `"packageApp": true`

2.  Fill out your target platform

    `"platform": "linux"`

3.  Fill out the target architecture

    `"arch": "x64"`

4.  Set the version of Electron you want it packaged up with(Defaults to 0.25.3)

    `"version": "0.25.3"`

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
* 

##Alternatives
[electrify](https://github.com/arboleya/electrify) built by @arboleya: This package offers a more intuitive solution to running/packaging your app on desktop

######Credits
Shoutout to sircharleswatson! He started the electrometeor boilerplate. I pretty much used his idea and expanded upon it for a package. 

maxogden [Electron-packager](https://github.com/maxogden/electron-packager)

mafintosh [Electron-prebuilt](https://github.com/mafintosh/electron-prebuilt)

=======
#History

###v0.0.21
Added option to kill meteor when electron is closed

###v0.0.20
Added the optional electron-packager options


###v0.0.19(Yes I messed up the versioning)
Fixed Electron not starting error

###v0.0.7

Fixed path issues on windows by using npm module path. Also, tweaked how Electron is started as paths that contain spaces broke everything

###v0.0.6

Updated Electron-packager to 4.0.2 (Windows support). Extra parameters are required.

###v0.0.5

Utilizes electron-prebuilt(instead of using a zipped up version) & electron-packager. On Linux & OSX you can package your app, if you try while on Windows it will display an error
	  
	  
![Imgur](http://i.imgur.com/7jnPWgS.png?1 "Running Electron on Plex Requests")
