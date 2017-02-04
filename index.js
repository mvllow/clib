const {app, BrowserWindow, clipboard} = require('electron')

app.on('ready', () => {
    let win = new BrowserWindow({width: 350, height: 400})

    win.on('closed', () => {
        win = null
    })

    win.loadURL(`file://${__dirname}/index.html`)
})
