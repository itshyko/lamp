const { app, BrowserWindow, Menu, Tray, screen } = require('electron')

let mainWindow

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        x: 0,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
    const displays = screen.getAllDisplays()
    let totalWidth = 0
    let totalHeight = 0
    displays.forEach(display => {
        totalWidth += display.bounds.width
        totalHeight = Math.max(totalHeight, display.bounds.height)
    })
    mainWindow.setBounds({
        x: - totalWidth,
        y: - totalHeight,
        width: totalWidth * 2,
        height: totalHeight * 2
    })

    mainWindow.loadFile('index.html')

    mainWindow.setIgnoreMouseEvents(true)
    mainWindow.setSkipTaskbar(true)
    mainWindow.setOpacity(0.9)

    mainWindow.on('ready-to-show', () => {
        mainWindow.setAlwaysOnTop(true, 'screen-saver')
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

let tray = null
app.whenReady().then(() => {
  tray = new Tray('icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: '90%', type: 'radio', click: () => adjustOpacity(0.9) },
    { label: '80%', type: 'radio', click: () => adjustOpacity(0.8) },
    { label: '70%', type: 'radio', click: () => adjustOpacity(0.7) },
    { label: '60%', type: 'radio', click: () => adjustOpacity(0.6) },
    { label: '50%', type: 'radio', click: () => adjustOpacity(0.5) },
    { label: '40%', type: 'radio', click: () => adjustOpacity(0.4) },
    { label: '30%', type: 'radio', click: () => adjustOpacity(0.3) },
    { label: '20%', type: 'radio', click: () => adjustOpacity(0.2) },
    { label: '10%', type: 'radio', click: () => adjustOpacity(0.1) },
    { label: 'Exit', role: 'quit' }
  ])
  tray.setToolTip('Lamp')
  tray.setContextMenu(contextMenu)
})

function adjustOpacity(value) {
    mainWindow.setOpacity(value)
}