'use strict'

const {app, clipboard, remote, screen, shell} = require('electron')
const storage = require('electron-json-storage')

try {
    const robot   = require('robotjs')
    var hasRobot      = true
} catch(err) {
    var hasRobot      = false
}

let {width, height} = screen.getPrimaryDisplay().workAreaSize

var defaultAppPath = 'C:\\Riot Games\\League of Legends\\LeagueClient.exe'
var appWindow = remote.getCurrentWindow()
var password = ''

// dom elements
var appClose         = document.getElementById('app-close'),
    appHide          = document.getElementById('app-hide'),
    fPassword        = document.getElementById('f-password'),
    fPasswordWrapper = document.getElementById('f-password-wrapper'),
    bLaunch          = document.getElementById('b-launch'),
    bLaunchAuto      = document.getElementById('b-launch-auto');

// event listeners
if (appClose) appClose.addEventListener('click', onDestroy)
if (appHide) appHide.addEventListener('click', onPause)
if (bLaunch) bLaunch.addEventListener('click', function() { launch() })
if (bLaunchAuto) bLaunchAuto.addEventListener('click', function() { launch(true) })

storage.get('password', (e, d) => {
    if (e) throw e

    if (d.obj) {
        if (fPassword) fPassword.value = d.obj
        if (fPasswordWrapper) fPasswordWrapper.classList.add('is-focused')
    }
})

function launch(auto = false) {
    var opened = shell.openItem(defaultAppPath)

    if (!opened) alert('LCU cannot be found. Please install to the default location. Custom paths will be enabled in future updates.')

    password = setConfig('password', fPassword.value)

    if (auto && hasRobot) {
        appWindow.minimize()

        setTimeout(function() {
            robot.moveMouse(width/2, height/2)
            robot.mouseClick()
            robot.keyTap('tab')
            robot.keyTap('tab')
            robot.typeString(password)
            appWindow.close()
        }, 10000);
    } else if (auto && !hasRobot) {
        alert('Automatic login is disabled on this platform.')
    } else {
        clipboard.writeText(password)
        appWindow.hide()

        setTimeout(function() {
            clipboard.clear()
            appWindow.close()
        }, 25000);
    }
}

function setConfig(k, v) {
    storage.set(k, { obj: v })

    return v
}

function onPause() {
    appWindow.minimize()
}

function onDestroy() {
    appWindow.close()
}
