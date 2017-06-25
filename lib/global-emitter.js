const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}

let mainWindow = null

const MainEmitter = new MyEmitter() 
MainEmitter.on('consoleEvent',() => {
  console.log("get it")
})
MainEmitter.on('hideApp',() => {
  console.log("get it")
})
MainEmitter.on('showApp',() => {
  console.log("get it")
})


module.exports = MainEmitter
