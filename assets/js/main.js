$(document).ready(function () {
    const {app, clipboard, remote, shell} = require('electron')
    const storage = require('electron-json-storage')
    const path = 'C:\\Riot Games\\League of Legends\\LeagueClient.exe'

    var window = remote.getCurrentWindow();
    var password

    storage.getMany(['locked', 'password'], (e, d) => {
        if (e) throw e

        if (d.locked.obj === true) lock()
        else unlock()

        if (d.password.obj) $('#password').val(d.password.obj)
    })

    $('#reset').click((e) => {
        storage.clear((e) => {
            if (e) throw e
        })

        unlock()
        $('#password').val('')
        clipboard.writeText('')
    })

    $('#lock').click((e) => {
        lock()
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
            password = setConfig('password', $('#password').val())

            clipboard.writeText(password)

            shell.openItem(path)

            setTimeout(function() {
                clipboard.writeText('')
                window.close();
            }, 25000);
    })

    function setConfig(k, v) {
        storage.set(k, { obj: v })

        return v
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

    // var hPassword = document.getElementById('password'),
    //     hPasswordIcon = document.getElementById('passwordIcon'),
    //     hPasswordToggle = document.getElementById('passwordToggle'),
    //     hLock = document.getElementById('lock')
    //
    // var path = 'C:\\Riot Games\\League of Legends\\LeagueClient.exe'
    //
    // var isLocked = false
    //
    // storage.getMany(['locked', 'password'], (error, data) => {
    //     if (error) throw error
    //
    //     if (data.locked.val === true) isLocked = true
    //     else isLocked = false
    //
    //     if (data.password.val) hPassword.value = data.password.val
    // })
    //
    // function setConfig(k, v) {
    //     storage.set(k, { val: v })
    //
    //     return v
    // }
    //
    // function lock() {
    //     isLocked = setConfig('locked', true)
    //
    //     hPassword.type = 'password'
    //     hPasswordIcon.innerHTML = 'visibility'
    //     hPasswordToggle.disabled = true
    // }
    //
    // function showPassword() {
    //     if (isLocked == false) {
    //         if (hPassword.type == 'password') {
    //             hPassword.type = 'text'
    //             hPasswordIcon.innerHTML = 'visibility_off'
    //         } else {
    //             hPassword.type = 'password'
    //             hPasswordIcon.innerHTML = 'visibility'
    //         }
    //     } else {
    //         alert('Cannot show password while program is locked. Please reset to unlock program.')
    //     }
    // }
    //
    // function launch() {
    //     setConfig('password', hPassword.value)
    //
    //     clipboard.writeText(hPassword.value)
    //
    //     // shell.openItem(path)
    //
    //     setTimeout(function() {
    //         clipboard.writeText('')
    //     }, 25000);
    // }
    //
    // function reset() {
    //     storage.clear((error) => {
    //         if (error) throw error;
    //     })
    //
    //     isLocked = false
    //     hPassword.value = ''
    //     hPassword.type = 'password'
    //     hPasswordIcon.innerHTML = 'visibility'
    //     hPasswordToggle.disabled = false
    // }

});
