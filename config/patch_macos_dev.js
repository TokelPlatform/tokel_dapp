const fs = require('fs-extra');
const path = require('path');
const plist = require('plist');

const packageJSON = require('../package.json');
const appPackageJSON = require('../src/electron/package.json');

if (process.platform === 'darwin') {
  console.log('Monkey patching info.plist...');
  const plistPath = path.resolve(
    __dirname,
    '..',
    'node_modules/electron/dist/Electron.app/Contents/Info.plist'
  );
  const plistContent = plist.parse(fs.readFileSync(plistPath, 'utf8'));

  const {
    build: { appId, productName },
  } = packageJSON;

  const { version } = appPackageJSON;

  plistContent.CFBundleIdentifier = appId;
  plistContent.CFBundleDisplayName = productName;
  plistContent.CFBundleExecutable = productName;
  plistContent.CFBundleName = productName;
  plistContent.CFBundleShortVersionString = version;
  plistContent.CFBundleVersion = version;

  fs.writeFileSync(plistPath, plist.build(plistContent));
}
