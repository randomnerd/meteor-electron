#Ayy Lmao

    meteor add jrudio:electron
    
Currently this is just a glorified web browser that starts when meteor starts up, useful for developing your app for electron.

**Electron-packager will have windows support soon.
I plan on integrating electron-packager with this package and that will work by reading the 'compile' boolean from your package.json file and will output your compiled app to the '.output/' folder

##This has not been tested on Mac, so at this time it should not work.

I have only tested this on Linux(Ubuntu 15.04) & Windows 8.1