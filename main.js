const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const pkg = require('./package.json')

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    fullscreenable: false,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 不集成 Nodejs
      webSecurity: false,
      preload: path.join(__dirname, './public/renderer.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })

  // 然后加载应用的 index.html。
  // package中的DEV为true时，开启调试窗口。为false时使用编译发布版本
  if(pkg.DEV){
    win.loadURL('http://localhost:3000/')
  }else{
    win.loadURL(url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  // 打开开发者工具。
  // win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

// 文件模块
// const BTFile = require('./sys_modules/BTFile')

// BTFile.getAppPath()