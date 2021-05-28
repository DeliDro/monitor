const ipc = require("electron").ipcRenderer
var term = new Terminal();
var term2 = new Terminal();

term.open(document.getElementById("terminal"));

term2.open(document.getElementById("terminal2"));

term.onData(e => {
    ipc.send("terminal.toTerm", e)
}
)

ipc.on("terminal.incData", function (event, data) {
    term.write(data)
}
)

term2.onData(e => {
    ipc.send("terminal2.toTerm", e)
}
)

ipc.on("terminal2.incData", function (event, data) {
    term2.write(data)
}
)

