#Electron for Meteor

#####Install

    meteor add jrudio:electron
    
This Meteor package starts when meteor starts up, useful for developing your app for electron.

[Here is a demo of Electron in use with meteor](https://www.youtube.com/watch?v=1OpsJp1_OK4)

#How it works
1.	When meteor starts up, it will create 1 folder in the root of your app and 2 sub-folders:

		/.electron	=>Electron is downloaded here
		  -  /electronApp	=> Your Electron-specific code goes here
		  -  /output 		=> Your app will be sent here when you package it
2.	It will proceed to download the boilerplate main.js & package.json needed for Electron
3.	Creates a package.json in the root if one is not present
4.	Runs Electron



These are the currently available options in your package.json


    {
      "package": true,          =>    Package your app and put it into .electron/output/
      "runOnStartup": false,    =>    Starts Electron with your app
      "appName": "myApp"        =>    The name of your executable
    }


###Notes

*	This has not been tested on Mac, so at this time it may not work.
*	Electron-packager will have windows support soon.
*	I have only tested this on Linux(Ubuntu 15.04) & Windows 8.1

*	This package does not get compiled when you build your meteor application for production, so do not have to worry about removing the package beforehand.

######Credit
Shoutout to sircharleswatson and the resources he used! He started the electrometeor boilerplate. I pretty much used his idea and expanded upon it for a package.

=======
#History
##v0.0.5

Utilizes electron-prebuilt(instead of using a zipped up version) & electron-packager. On Linux & OSX you can package your app, if you try while on Windows it will display an error
>>>>>>> packager

	  
	  
![Imgur](http://i.imgur.com/7jnPWgS.png?1 "Running Electron on Plex Requests")
