const $ = require('jquery');
const { ipcRenderer } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3');
const os = require('os')


let dbPathBasedOnOS;
if (process.platform === 'win32') {
    const appData = process.env.LOCALAPPDATA;
    dbPathBasedOnOS = path.join(appData, 'Google/Chrome/User Data/Default/History');
}
if (process.platform === 'linux') {
    dbPathBasedOnOS = '/home/' + os.userInfo().username + '/.config/google-chrome/Default/History';
}

function handleLoadOverlay() {
    $('#overlay').addClass('animate__animated');
    let slide = () => {
        $('#overlay').addClass('animate__slideOutLeft');
    }
    let noDpy = () => {
        $('#overlay').css({
            display: 'none'
        })
    }
    $('#slideDo').on('click', () => {
        slide();
        setTimeout(noDpy, 2000);
    });
}

function appendRowToActivityList(id, title, url) {
    let row = `
        <tr>
            <th scope="col">${id}</th>
            <td>${title}</td>
            <td><a target="_blank" href="${url}">${url}</a></td>
        </tr>
    `;
    $('#activityList').append(row);
}

function handleDB() {
    console.log('Opening Chrome history Database...');
    console.log('Finding Database on path: ' + dbPathBasedOnOS);
    const db = new sqlite3.Database(dbPathBasedOnOS, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            alert(err.message);
            return;
        }
        console.log('Opened chrome history database from path: ' + dbPathBasedOnOS);
    });
    db.serialize(() => {
        db.each('SELECT id,title,url FROM urls', (err, row) => {
            if (err) {
                alert(err.message);
            }
            appendRowToActivityList(row.id, row.title, row.url);
        });
        console.log('Recieved data.');
    });
    db.close((err) => {
        if (err) {
            alert(err.message);
            return;
        }
        console.log('Closed chrome history database')
    });
}

function onLoad() {
    // fs.exists(sftkAppData, (exists) => {
    //     if (!exists) {
    //         fs.mkdir(sftkAppData, {
    //             mode: 1
    //         }, (err) => {
    //             console.error(err.message);
    //         });
    //     } else {
    //     }
    // });
}

window.onload = onLoad;