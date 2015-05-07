#Electron for Meteor

    meteor add jrudio:electron
    
Currently this is just a glorified web browser that starts when meteor starts up, useful for developing your app for electron.

**Electron-packager will have windows support soon.
I plan on integrating electron-packager with this package and that will work by reading the 'compile' boolean from your package.json file and will output your compiled app to the '.output/' folder

##This has not been tested on Mac, so at this time it should not work.

I have only tested this on Linux(Ubuntu 15.04) & Windows 8.1

This package does not get compiled when you build your meteor application for production, so do not have to worry about removing the package beforehand.

You can optionally not run Electron when you start up your meteor project, to do so just set "runOnStartup" to false in your package.json


    {
    	"runOnStartup": false
	  }