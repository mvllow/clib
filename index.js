const {app, BrowserWindow, clipboard} = require('electron')

app.on('ready', () => {
    let mainWindow = new BrowserWindow({
        width:       350,
        height:      450,
        frame:       false,
        resizable:   false,
        maximizable: false,
        show:        false,
        icon:        './build/icon.ico'
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.loadURL(`file://${__dirname}/index.html`)
})

app.on('window-all-closed', () => {
    app.quit()
})
