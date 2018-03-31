const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen
const shell = electron.shell
const EventEmitter = require('events')

const fs = require('fs')
const os = require('os')
const path = require('path')

class MyEmitter extends EventEmitter {};

const takeScreenshotEmitter = new MyEmitter();

takeScreenshotEmitter.on('takeScreenshot',(rect) => {
  Object.keys(rect).forEach(function (key) {
    rect[key] = rect[key] * window.devicePixelRatio;
  });
  const thumbSize = determineScreenShotSize();
  const targetScreenId = getTargetScreenId();

  // → size will be got by React
  let options = { types: ['screen'], thumbnailSize: thumbSize }
  //let options = { types: ['screen','window'], thumbnailSize: thumbSize }

  desktopCapturer.getSources(options, function (error, sources) {
    if (error) return console.log(error)

    sources.forEach(function (source) {
      let sourceId = source.id.replace('screen:', '');
      if (targetScreenId === sourceId) {
        const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')
        const cropedImage = source.thumbnail.crop(rect);
        //const cropedImage = source.thumbnail;

        fs.writeFile(screenshotPath, cropedImage.toPng(), function (error) {
          if (error) return console.log(error)
          shell.openExternal('file://' + screenshotPath)
        })
      }
    })
  })
// TODO
// - screen 判定
// - 画像を同表示するか問題
// - どうやって最終的に保存させるか問題

})

module.exports = takeScreenshotEmitter

  //


function determineScreenShotSize () {
  const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
  //const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: screenSize.width * window.devicePixelRatio,
    height: screenSize.height * window.devicePixelRatio
  }
}


function getTargetScreenId (){
  return electronScreen.getPrimaryDisplay().id.toString();
}
