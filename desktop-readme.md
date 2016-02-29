
###How to use the modified Meteor-tool
Use the Meteor-tool modified with desktop support
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
