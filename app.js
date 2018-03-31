'use strict'
const electron = require('electron')
const React = require('react')
const domready = require('domready')
const globalEmitter = require('./lib/global-emitter')
const takeScreenshotEmitter = require('./lib/take-screenshot')
const BrowserWindow = require('electron').remote.BrowserWindow

const os = require('os')
//const mainProcessEmitter = require('./main')

function createRect (a, b) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y)
  }
}

const App = React.createClass({
  getInitialState: function () {
    return {
      x: 0,
      y: 0,
      cropping: false,
      downPoint: {},
      rect: {}
    }
  },

  render: function () {
    const self = this

    return React.DOM.div({
      className: 'window',
      onMouseMove: function (e) {
        self.setState({
          x: e.clientX,
          y: e.clientY
        })

        if (!self.state.cropping) return

        self.setState({
          rect: createRect(
            self.state.downPoint,
            {
              x: e.clientX,
              y: e.clientY
            }
          )
        })
      },
      onMouseUp: function (e) {
        console.log(JSON.stringify(self.state.rect) + "test")
        console.log(self.state.rect + ":test_2")
        createNewWindow(JSON.stringify(self.state.rect))
        globalEmitter.emit('consoleEvent');
        globalEmitter.emit('takeScreenshot');

        var pictureSize = self.state.rect
        console.log("first : ");
        var pictureSizeLog = pictureSize;
        console.log(pictureSizeLog.y.toString())
        console.log(os.type)

        var menuHeight = 0;
        if(os.type()=='Darwin'){
          console.log("This is Mac os")
          console.log(electron.screen.getMenuBarHeight())
          menuHeight = electron.screen.getMenuBarHeight();
        }
        console.log(pictureSize.y)
        pictureSize['y'] += menuHeight;
        console.log(pictureSize.y)
        console.log("second : ");
        console.log(pictureSize)

        takeScreenshotEmitter.emit('takeScreenshot',pictureSize);
        console.log("AfterEvent")
        //globalEmitter.emit('createNewWindow',JSON.stringify(self.state.rect))
        self.setState({ cropping: false, rect: {} })
      },
      onMouseDown: function (e) {
        self.setState({ downPoint: { x: e.clientX, y: e.clientY }, cropping: true })
      }
    }, [
      React.DOM.div(
        {
          className: 'rect',
          key: 'rect',
          style: { left: self.state.rect.x, top: self.state.rect.y, width: self.state.rect.width, height: self.state.rect.height }
        }
      ),
      React.DOM.div(
        {
          className: 'cursor',
          key: 'cursor',
          style: { left: self.state.x, top: self.state.y }
        },
        React.DOM.div({ className: 'indicator'}, `${self.state.x}\n${self.state.y}`)
      )
    ])
  }
})

domready(function () {
  React.render(React.createFactory(App)(), document.querySelector('body'))
})

function createNewWindow(newWindow) {
  if (Object.keys(newWindow).length) {
    return;
  }
  let mainWindow = new BrowserWindow({
    x: newWindow.x,
    y: newWindow.y,
    width: newWindow.width,
    height: newWindow.false,
    frame: false,
    show: true,
    resizable: false,
    //transparent:true,
    'always-on-top': true
  })
}
