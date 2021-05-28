const {app, BrowserWindow, ipcMain} = require("electron");
const os = require("os");
const pty = require("node-pty");

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

console.log("dirname : ", __dirname);

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true
            
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index-e-dip.html`);
    mainWindow.on("closed", function() {
        mainWindow = null;
    });


    //ipcing

    var ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess.onData(function (data) {
        mainWindow.webContents.send("terminal.incData", data);
    });

    ipcMain.on("terminal.toTerm", (event, data) => {
        ptyProcess.write(data);
    });

    // hytf
    var ptyProcess2 = pty.spawn(shell, ["python"], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess2.onData(function (data) {
        mainWindow.webContents.send("terminal2.incData", data);
    });

    ipcMain.on("terminal2.toTerm", (event, data) => {
        ptyProcess2.write(data);
    });


}


app.on("ready", createWindow);

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    if (mainWindow === null) {
        createWindow();
    }
});