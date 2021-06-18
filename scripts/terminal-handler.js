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
    const ptyProcess = pty.spawn(shell, [serveurLocal.fichier], {
        name: "xterm-color",
        cwd: process.env.HOME, // Répertoire de départ
        env: process.env
    });
    
    var terminal = terminal_ || new Terminal()
    
    if (!terminal_) terminal.open(document.getElementById(serveurLocal.id));
    else terminal.clear();
    
    ptyProcess.onData((data) => terminal.write(data));

    terminal.onData((data) => ptyProcess.write(data));
    
    let temps;
    
    if (!terminalData.find(i => i.id === serveurLocal.id)) {
        temps = initTemps(serveurLocal.id);
    }
        
    else {
        clearInterval(terminalData.find(i => i.id === serveurLocal.id).temps);
        temps = initTemps(serveurLocal.id);
    }

    return { id: serveurLocal.id, processus: ptyProcess, terminal: terminal, temps: temps};
}


// AFFICHAGE
const show = (toShow) => {
    const showables = ["ajoutServeurLocal", "add", "config","button"].filter(i => i !== toShow);

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
            document.getElementById(id+"-temps").hidden = true;
        });

    // Affichage du terminal sélectionné
    document.getElementById(idTerminal).hidden = false;
    document.getElementById(idTerminal + '-button').className = 'bg-blue-600 rounded-t-xl text-sm border-r-2 border-white p-1 pl-2 pr-2 text-white font-bold hover:bg-blue-400 ease-in-out duration-100 cursor-pointer capitalize focus:outline-none';
    
    //Afficher l'adresse et le port
    let serveurLocal = listeServeurs.find(i => i.id === idTerminal)
    let p = `<div class="border-2 border-gray-400 rounded-lg pr-2 pl-2">ADRESSE: ${serveurLocal.adresse}</div>
            <div class="border-2 border-gray-400 rounded-lg pr-2 pl-2 ml-2">PORT: ${serveurLocal.port}</div>`
    document.getElementById('infos').innerHTML = p
    
    //Afficher le fichier
    document.getElementById("fichierDuBas").innerHTML=listeServeursLances.filter(i => i.id===idTerminal)[0].fichier
    
    // Signifier que le terminal sélectionné est idTerminal;
    currentTerminal = idTerminal

    //Afficher le temps depuis le lancement
    document.getElementById(idTerminal + "-temps").hidden = false;
}

function killProcess(idTerminal = currentTerminal) {
    // Fonction d'arrêt du terminal courant
    // Appeler la fonction scripts/kill.bat avec en argument le processus à arrêter
    let {processus, terminal} = terminalData.find(i=> i.id === idTerminal);
    
    require('child_process')
        .exec(`cmd /c ${require("path").resolve(__dirname, "scripts/kill.bat")} ${processus.pid}`, () => {
            // Afficher dans le terminal un message d'arrêt
            terminal.write(`\n\r[${Date().split(" GMT")[0]}] [e-Dip Monitor] *** ARRÊT DU PROCESSUS ***`);
            terminalData.find(i => i.id === idTerminal).processus = null;
        });

    clearInterval(terminalData.find(i => i.id === idTerminal).temps)

    let serveurLocal = listeServeurs.find(i => i.id === idTerminal)
    log = new Log()
        .type(0)
        .evenement(Log.EVENTS.ARRET)
        .URI(`${serveurLocal.adresse} : ${serveurLocal.port}`)
        .serveur(`${serveurLocal.nomServeur}`)
        .donnees("Arrêt de " + serveurLocal.nomServeur)
        .save();
}

function restartProcess(idTerminal = currentTerminal) {
    let { processus, terminal } = terminalData.find(i => i.id === idTerminal);
    // Arrêter le terminal courant
    if (processus!==null){
        require('child_process')
            .exec(`cmd /c ${require("path").resolve(__dirname, "scripts/kill.bat")} ${processus.pid}`);
    }
    // Vider le contenu du terminal
    // Créer un nouveau processus
    // Lier les données terminal <-> processus
    // Ne pas supprimer le terminal déjà créé

    let serveurLocal = listeServeurs.find(i => i.id === idTerminal);
    
    terminalData[terminalData.indexOf(terminalData.find(i => i.id === idTerminal))] = createTerminal(serveurLocal,terminal);
    log = new Log()
        .type(0)
        .evenement(Log.EVENTS.REDEMARRAGE)
        .URI(`${serveurLocal.adresse} : ${serveurLocal.port}`)
        .serveur(`${serveurLocal.nomServeur}`)
        .donnees("Redémarrage de "+serveurLocal.nomServeur)
        .save();
}

//Ajouter un terminal depuis la liste avec +
function affichePlus(){
    document.getElementById('button').innerHTML = ""
    let listeServeurLance = listeServeurs
        .filter(i => i.lancerAuDemarrage === false)//Liste des serveurs qu'on peut lancer 
    for (let serveur of listeServeurLance) {
        //ajout du nom du serveur
        let input = document.createElement("input");
        input.setAttribute('class', 'bg-transparent text-white focus:outline-none hover:bg-blue-400 w-full');
        input.setAttribute('type', 'button')
        input.addEventListener('click' , function () {
            listeServeurs[listeServeurs.
                indexOf(listeServeurs.
                    find(i => i===serveur))].lancerAuDemarrage = true
            show('button')
            lancerServeur("démarrage de ")
            const fs = require('fs')
            let son = JSON.stringify(listeServeurs, null, 2)
            fs.writeFileSync('data/serveurs-locaux.json', son)
        })
        input.value = serveur.nomServeur;
        let div = document.createElement('div')
        div.appendChild(input);
        document.getElementById('button').appendChild(div)
    }
}

// Temps de lancement d'un serveur
function initTemps(idTerminal) {
    let temps = { h: 0, m: 0, s: 0 };

    const f = (t) => t < 10 ? "0" + t : t;

    return setInterval(() => {
        temps.s += 1;
        if (temps.s === 60) {
            temps.s = 0;
            temps.m += 1;
            if (temps.m == 60) {
                temps.m = 0;
                temps.h += 1;
            }
        }
        document.getElementById(idTerminal + "-temps").innerHTML =`Temps écoulé: ${f(temps.h)}:${f(temps.m)}:${f(temps.s)}`;
    }, 1000);
}