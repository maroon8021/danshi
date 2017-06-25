'use strict'
const electron = require('electron')
const React = require('react')
console.log(React)
const domready = require('domready')
const globalEmitter = require('./lib/global-emitter')
console.log(globalEmitter)
const BrowserWindow = require('electron').remote.BrowserWindow
console.log(BrowserWindow)
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
        createNewWindow(JSON.stringify(self.state.rect))
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
  let mainWindow = new BrowserWindow({
    x: newWindow.x,
    y: newWindow.y,
    width: newWindow.width,
    height: newWindow.false,
    frame: true,
    show: true,
    resizable: false,
    //transparent:true,
    'always-on-top': true
  })
}
