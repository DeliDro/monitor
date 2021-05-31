const { app, BrowserWindow} = require("electron");

// NE PAS SUPPRIMER LA LIGNE SUIVANTE !!!
// ELLE PERMET DE CREER LES TERMINAUX DYNAMIQUEMENT
app.allowRendererProcessReuse = false;

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
    mainWindow.on("closed", function () {
        mainWindow = null;
    });

}


app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});