#History

###v0.1.0
Removed hacky ways to get electron-prebuilt running.

Doesn't download the main.js and package.json (Electron app) anymore - it is now generated.

Creates an electron.json instead of settings.json / package.json.

Removed isDesktop() helpers. Updated electron-prebuilt to v0.31.0 and electron-packager to v5.0.2.

Hopefully alleviates any errors starting up Electron.

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
