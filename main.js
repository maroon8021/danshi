'use strict'
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalEmitter = require('./lib/global-emitter')
//const BrowserWindow = require('browser-window')

//const crashReporter = electron.crashReporter
//crashReporter.start({})

let mainWindow = null
console.log("test")
app.on('window-all-closed', function () {
  app.quit()
})




const Tray = electron.Tray
const Menu = electron.Menu

let appIcon = null;

app.on('ready', function () {
  const Screen = electron.screen

  const size = Screen.getPrimaryDisplay().size

  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    frame: true,
    show: true,
    transparent: true,
    resizable: false,
    'always-on-top': true
  })

  mainWindow.maximize()

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.on('closed', function () {
    mainWindow = null
  })

})

/*
  let onApp = false

app.on('ready', () => {
  appIcon = new Tray(`${__dirname}/images/danshi_icon.png`)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open', accelerator: 'Command+0', click: appToggle()},
    {label: '終了', accelerator: 'Command+Q', role: 'quit'},
    {label: 'hide', click: mainWindow.hide()},
    ])
  
  appIcon.setContextMenu(contextMenu)

function appToggle(){
  onApp ? toggleOnApp(false) : toggleOnApp(true)
function toggleOnApp(boolean) {
  boolean ? mainWindow.show() : mainWindow.hide()
  onApp = boolean;
} 
}

})
*/


globalEmitter.on('event', () => {
  console.log('an event occurred!');
});
globalEmitter.on('createNewWindow', (newWindow) => {
  mainWindow = new BrowserWindow({
    x: newWindow.x,
    y: newWindow.y,
    width: newWindow.width,
    height: newWindow.false,
    frame: true,
    show: true,
    resizable: false,
    'always-on-top': true
  })
});




/*
const globalShortcut = electron.globalShortcut

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+ESC', () => {
    mainWindow.hide()
  })
  globalShortcut.register('CommandOrControl+1', () => {
    mainWindow.show()
  })
  globalShortcut.register('CommandOrControl+3', () => {
    mainProcessEmitter.emit('event');
  })
  globalShortcut.register('CommandOrControl+2', () => {
    createNewWindow(200,200)
  })
  function createNewWindow(a,b){
    mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: a,
    height: b,
    frame: false,
    show: true,
    resizable: false,
    'always-on-top': true
  })
  }
})
*/
