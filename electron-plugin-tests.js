_test = test;
Tinytest.add('Are the slashes set correctly for windows?', function (test) {
	isWindows = true;
	Electron.setElectronType();
  test.equal(Electron.rootDir.match(/\\+/g).length, 5);
});

Tinytest.add('Is electronType set to .exe for windows?', function (test) {
	isWindows = true;
	Electron.setElectronType();
  test.equal(Electron.electronType, 'electron.exe');
});

Tinytest.add('Did the folders/files get created in their proper place?', function (test) {
  test.equal(_test('-e', Electron.electronPath), true) && test.equal(_test('-e', Electron.tmpPath), true) && test.equal(_test('-e', Electron.electronApp), true);
});

Tinytest.add('Does cleanup() work?', function (test) {
	mkdir('-p', Electron.tmpPath);;
	Electron.cleanup();
  test.equal(_test('-e', Electron.tmpPath), false);
});
