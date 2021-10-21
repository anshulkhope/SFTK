const path = require('path');
const sqlite3 = require('sqlite3');
const os = require('os');
const fs = require('fs');

let originalDbPathBasedOnOS;
let newDbPath;
let sftkAppData;
if (process.platform === 'win32') {
    const appData = process.env.LOCALAPPDATA;
    originalDbPathBasedOnOS = path.join(appData, 'Google/Chrome/User Data/Default/History');
    sftkAppData = path.join(appData, 'sftk-data');
}
if (process.platform === 'linux') {
    let userConfigDir = '/home/' + os.userInfo().username + '/.config';
    originalDbPathBasedOnOS = path.join(userConfigDir + '/google-chrome/Default/History');
    sftkAppData = path.join(userConfigDir, 'sftk-data');
}
newDbPath = path.join(sftkAppData, 'chrome-history');

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
    console.log('Finding Database on path: ' + originalDbPathBasedOnOS);
    console.log('Copied DB to: ' + newDbPath);
    const db = new sqlite3.Database(newDbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            alert(err.message);
            return;
        }
        console.log('Opened chrome history database from path: ' + newDbPath);
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
    fs.exists(sftkAppData, (exists) => {
        if (!exists) {
            fs.mkdir(sftkAppData, (err) => {
                console.error(err.message);
            });
        } else {
            fs.readFile(originalDbPathBasedOnOS, (err, data) => {
                if (err) {
                    console.error(err.message);
                }

                fs.writeFile(newDbPath, data, {}, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                })
            });
        }
    });
    handleDB();
}

window.onload = onLoad;