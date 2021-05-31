const os = require("os");
const pty = require("node-pty");
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

/**
 * Ajout d'un terminal à linterface principale
 * @author Déli Dro Kieu (https://github.com/DeliDro)
 * @param { {
        adresse: string,
        fichier: string,
        id: string,
        lancerAuDemarrage: string,
        nomServeur: string,
        port: number
    }} terminal Objet Terminal stocké dans la base de données
  */
function createTerminal(serveurLocal) {
    const ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cwd: process.env.HOME, // Répertoire de départ
        env: process.env,
    });

    const terminal = new Terminal();
    terminal.open(document.getElementById(serveurLocal.id));

    ptyProcess.onData((data) => terminal.write(data));

    terminal.onData((data) => ptyProcess.write(data));
}

// AFFICHAGE
const show = (toShow) => {
    const showables = ["ajoutServeurLocal", "add", "config"].filter(i => i !== toShow);

    for (const showable of showables) {
        document.getElementById(showable).hidden = true;
    }

    document.getElementById(toShow).hidden = !document.getElementById(toShow).hidden;

};


let selectTerminal = (idTerminal) => {
    let listeIds = []
    let listeServeursLances = listeServeurs.filter(i => i.lancerAuDemarrage === true)

    listeIds = listeServeursLances
        .map(serveur => serveur.id) // Récupération des ID
        .filter(i => i !== idTerminal) // Exlusion de l'ID du terminal à afficher
        .forEach(id => { // Masquage des autres terminaux
            document.getElementById(id).hidden = true;
        });

    // Affichage du terminal sélectionné
    document.getElementById(idTerminal).hidden = false;
}

// Temps de lancement d'un serveur
function initTerminalTime(idTerminal) {
    let temps = { h: 0, m: 0, s: 0 };

    const f = (t) => t < 10 ? "0" + t : t;

    return setInterval(() => {
        temps.s += 1;
        if (temps.s === 60) {
            temps.s = 0;
            temps.m += 1;
            if (temps.m == 60) {
                temps.m = 0;
                temps.h += 1
            }
        }
        document.getElementById(idTerminal + "-temps").innerHTML = `${f(temps.h)}:${f(temps.m)}:${f(temps.s)}`;
    }, 1000);
}