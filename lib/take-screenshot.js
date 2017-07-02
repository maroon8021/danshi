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
  const thumbSize = determineScreenShotSize()
  // → size will be got by React
  let options = { types: ['screen'], thumbnailSize: thumbSize }

  desktopCapturer.getSources(options, function (error, sources) {
    if (error) return console.log(error)

    sources.forEach(function (source) {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')
        const cropedImage = source.thumbnail.crop(rect);

        fs.writeFile(screenshotPath, cropedImage.toPng(), function (error) {
          if (error) return console.log(error)
          shell.openExternal('file://' + screenshotPath)
        })
      }
    })
  })

})

module.exports = takeScreenshotEmitter
  
  // 


function determineScreenShotSize () {
  const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
}