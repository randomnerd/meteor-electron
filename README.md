#Electron for Meteor

#####Install

    meteor add jrudio:electron
    
Currently this is just a glorified web browser that starts when meteor starts up, useful for developing your app for electron.

[Here is a demo of Electron in use with meteor](https://www.youtube.com/watch?v=1OpsJp1_OK4)

#How it works
1.	When meteor starts up, it will check for 3 folders in the root of your app(It will be created if they are not present):

		/.electron	=>Electron is downloaded here
		/.electronApp	=>Your Electron-specific code goes here
		/.tmp 		=>Temporary folder to download electron. This gets cleaned up when electron is unzipped.
2.	It will proceed to download Electron if not present as well as the boilerplate main.js & package.json needed for Electron
3.	Creates a package.json in the root if one is not present
4.	Runs Electron



You can optionally not run Electron when you start up your meteor project, to do so just set "runOnStartup" to false in your package.json


    {
    	"runOnStartup": false
    }


###Notes

*	This has not been tested on Mac, so at this time it may not work.
*	Electron-packager will have windows support soon.I plan on integrating electron-packager with this package and that will work by reading the 'compile' boolean from your package.json file and will output your compiled app to the '.output/' folder

*	I have only tested this on Linux(Ubuntu 15.04) & Windows 8.1

*	This package does not get compiled when you build your meteor application for production, so do not have to worry about removing the package beforehand.


	  
	  
![Imgur](http://i.imgur.com/7jnPWgS.png?1 "Running Electron on Plex Requests")
