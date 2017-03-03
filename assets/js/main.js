$(document).ready(function () {
    const {app, clipboard, remote, shell} = require('electron')
    const storage = require('electron-json-storage')
    const robot = require('robotjs')
    const path = 'C:\\Riot Games\\League of Legends\\LeagueClient.exe'

    var window = remote.getCurrentWindow()
    var password = ''
    var flags = false

    storage.getMany(['locked', 'password', 'flags'], (e, d) => {
        if (e) throw e

        if (d.locked.obj === true) lock()
        else unlock()

        if (d.password.obj) $('#password').val(d.password.obj)

        if (d.flags.obj === true) flags = true
        else flags = false

        getFlags()
    })

    $('#reset').click((e) => {
        storage.clear((e) => {
            if (e) throw e
        })

        unlock()

        $('#password').val('')
        clipboard.clear()
    })

    $('#lock').click((e) => {
        lock()
    })

    $('#flags').click((e) => {
        if (flags) flags = false
        else flags = true

        getFlags()
    })

    $('#passwordToggle').click((e) => {
        if ($('#password').attr('type') == 'password') {
            $('#password').attr('type', 'text')
            $('#passwordToggle').addClass('active')
        } else {
            $('#password').attr('type', 'password')
            $('#passwordToggle').removeClass('active')
        }
    })

    $('#launch').click((e) => {
            var opened = shell.openItem(path)
            if (!opened) alert('League of Legends cannot be found. Please install to the default location. Custom paths will be enabled in future updates.')

            password = setConfig('password', $('#password').val())

            clipboard.writeText(password)

            if (flags) {
                setTimeout(function() {
                    robot.moveMouse(1400, 408)
                    robot.mouseClick()
                    robot.typeString(password)
                    robot.keyTap('enter')
                    clipboard.clear()
                    window.close()
                }, 10000);
            } else {
                setTimeout(function() {
                    clipboard.clear()
                    window.close()
                }, 25000);
            }
    })

    function setConfig(k, v) {
        storage.set(k, { obj: v })

        return v
    }

    function getFlags() {
        if (flags) {
            setConfig('flags', true)
            $('#flags').addClass('active')
            $('#flags').text('Flags Enabled')
        } else {
            setConfig('flags', false)
            $('#flags').removeClass('active')
            $('#flags').text('Flags Disabled')
        }
    }

    function lock() {
        setConfig('locked', true)

        $('#lock').addClass('active')
        $('#password').prop('disabled', true)
        $('#password').attr('type', 'password')
        $('#passwordToggle').attr('disabled', 'true')
        $('#passwordToggle').removeClass('active')
    }

    function unlock() {
        $('#lock').removeClass('active')
        $('#password').prop('disabled', false)
        $('#password').attr('type', 'password')
        $('#passwordToggle').removeClass('active')
    }
});
