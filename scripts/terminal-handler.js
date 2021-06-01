const os = require("os");
const pty = require("node-pty");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

/**
 * Ajout d'un terminal à linterface principale
 * @author Déli Dro Kieu (https://github.com/DeliDro)
 * @param {JSON} serveurLocal Objet stocké dans la base de données
 * @param {object} terminal_ Terminal xterm existant
  */
function createTerminal(serveurLocal, terminal_) {
    const ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cwd: process.env.HOME, // Répertoire de départ
        env: process.env
    });
    
    var terminal = terminal_ || new Terminal();
    
    if (!terminal_) terminal.open(document.getElementById(serveurLocal.id));
    else terminal.clear();
    
    ptyProcess.onData((data) => terminal.write(data));

    terminal.onData((data) => ptyProcess.write(data));
    
    return {id: serveurLocal.id, processus: ptyProcess, terminal: terminal};
}

// AFFICHAGE
const show = (toShow) => {
    const showables = ["ajoutServeurLocal", "add", "config"].filter(i => i !== toShow);

    for (const showable of showables) {
        document.getElementById(showable).hidden = true;
    }

    document.getElementById(toShow).hidden = !document.getElementById(toShow).hidden;

};


let currentTerminal

let selectTerminal = (idTerminal) => {
    let listeIds = []
    let listeServeursLances = listeServeurs.filter(i => i.lancerAuDemarrage === true)

    listeIds = listeServeursLances
        .map(serveur => serveur.id) // Récupération des ID
        .filter(i => i !== idTerminal) // Exlusion de l'ID du terminal à afficher
        .forEach(id => { // Masquage des autres terminaux
            document.getElementById(id).hidden = true;
            document.getElementById(id + '-button').className = 'bg-gray-400 rounded-t-xl text-sm border-r-2 border-white p-1 pl-2 pr-2 hover:bg-blue-400 ease-in-out duration-100 cursor-pointer capitalize focus:outline-none';
        });

    // Affichage du terminal sélectionné
    document.getElementById(idTerminal).hidden = false;
    document.getElementById(idTerminal + '-button').className = 'bg-blue-600 rounded-t-xl text-sm border-r-2 border-white p-1 pl-2 pr-2 text-white font-bold hover:bg-blue-400 ease-in-out duration-100 cursor-pointer capitalize focus:outline-none';
    
    document.getElementById("fichierDuBas").value=listeServeursLances.filter(i => i.id===idTerminal)[0].fichier
    
    // Signifier que le terminal sélectionné est idTerminal;
    currentTerminal = idTerminal
}

function killProcess() {
    // Fonction d'arrêt du terminal courant
    // Appeler la fonction scripts/kill.bat avec en argument le processus à arrêter
    let {processus, terminal} = terminalData.find(i=> i.id === currentTerminal);
    
    require('child_process')
        .exec(`cmd /c ${require("path").resolve(__dirname, "scripts/kill.bat")} ${processus.pid}`, () => {
            // Afficher dans le terminal un message d'arrêt
            terminal.write(`\n\r[${Date().split(" GMT")[0]}] [e-Dip Monitor] *** ARRÊT DU PROCESSUS ***`);
            terminalData.find(i => i.id === currentTerminal).processus = null;
        });
    
}

function restartProcess() {
    let { processus, terminal } = terminalData.find(i => i.id === currentTerminal);
    // Arrêter le terminal courant
    if (processus!==null){
        require('child_process')
            .exec(`cmd /c ${require("path").resolve(__dirname, "scripts/kill.bat")} ${processus.pid}`, () => {
                terminalData.find(i => i.id === currentTerminal).processus = null;
            });
    }
    // Vider le contenu du terminal
    // Créer un nouveau processus
    // Lier les données terminal <-> processus
    // Ne pas supprimer le terminal déjà créé

    let serveurLocal = listeServeurs.find(i => i.id === currentTerminal)

    terminalData[terminalData.indexOf(terminalData.find(i => i.id === currentTerminal))] = createTerminal(serveurLocal,terminal);
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