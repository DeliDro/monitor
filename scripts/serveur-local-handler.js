const { info } = require('console');
const { kill } = require('process');
const { Terminal } = require('xterm');

// SERVEURS LOCAUX
function getServeursLocaux() {
    listeServeurs = getJSONData("serveurs-locaux");
}

function getServeurLocal(id) {
    return getJSONData("serveurs-locaux").find(serveur => serveur.id = id);
}

function addServeurLocal(data) {

}

function editServeurLocal() {

}

function deleteServeurLocal(id) {

}

// CONFIGURATION SERVEURS LOCAUX
function updateConfigLocalView() {
    const serveur = listeServeurs
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurEnregistrer").value);

    afficheInfoServeur(serveur);
}

function afficheNomServeur(info = listeServeurs[0]) {
    document.getElementById('listeNomServeurEnregistrer').innerHTML = ""
    for (let serveur of listeServeurs) {
        //ajout du nom du serveur
        let div = document.createElement("option");
        div.setAttribute('class', 'nomServeur');
        div.innerHTML = serveur.nomServeur;
        document.getElementById('listeNomServeurEnregistrer').appendChild(div);
    }

    if (listeServeurs.length != 0) {
        afficheInfoServeur(info)
    }
}

function afficheInfoServeur(objetServeur) {
    const update = (id, value, attr) => document.getElementById(id)[attr] = value;

    const serveurs = [
        ["serveurLocal", objetServeur.nomServeur, "value"],
        ["addressLocal", objetServeur.adresse, "value"],
        ["portLocal", objetServeur.port, "value"],
        ["fichierLocal", objetServeur.fichier, "value"],
        ["lancerAuDemarrageLocal", objetServeur.lancerAuDemarrage, "checked"]
    ];

    serveurs.map(serveur => update(...serveur));
}

// AJOUT SERVEUR LOCAL
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

let listeServeurs = []

const creerServeur = () => {
    let serveurInfos = {
        id: "sl-0" + (listeServeurs.length + 1),
        nomServeur: document.getElementById("nom-serveur-local").value,
        adresse: document.getElementById("address-serveur-local").value,
        port: document.getElementById("port-serveur-local").value,
        fichier: document.getElementById("fichier-serveur-local").value,
        lancerAuDemarrage: document.getElementById("lancerAuDemarrage-serveur-local").checked
    }
    listeServeurs.push(serveurInfos)
    log = new Log()
        .type(0)
        .evenement(Log.EVENTS.CREATION)
        .URI(`${serveurInfos.adresse} : ${serveurInfos.port}`)
        .serveur(`${serveurInfos.nomServeur}`)
        .donnees("Cr??ation de " + serveurInfos.nomServeur)
        .save();
}

let enregistrerServeurLocal = () => {
    if (listeServeurs.length === 0) {
        creerServeur()
    } else {
        let b = listeServeurs
        b = b.filter(i => i.nomServeur == document.getElementById("nom-serveur-local").value)
        if (b.length === 0) {
            creerServeur()
        }
    }
    const fs = require('fs')
    let son = JSON.stringify(listeServeurs, null, 2)
    fs.writeFileSync('data/serveurs-locaux.json', son);

    lancerServeur("d??marrage de ")
}


let modifierServeurLocal = () => {
    const serveur = listeServeurs
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurEnregistrer").value);

    serveur.nomServeur = document.getElementById("serveurLocal").value;
    serveur.adresse = document.getElementById("addressLocal").value;
    serveur.port = document.getElementById("portLocal").value;
    serveur.fichier = document.getElementById("fichierLocal").value;
    serveur.lancerAuDemarrage = document.getElementById("lancerAuDemarrageLocal").checked

    log = new Log()
        .type(0)
        .evenement(Log.EVENTS.MODIFICATION)
        .URI(`${serveur.adresse} : ${serveur.port}`)
        .serveur(`${serveur.nomServeur}`)
        .donnees("Modification de " + serveur.nomServeur)
        .save();

    lancerServeur("d??marrage de ")

    if (serveur.lancerAuDemarrage === true){
        restartProcess(serveur.id)
    }else{
        if (document.getElementById(serveur.id) !== null) {
            killProcess(serveur.id)
            document.getElementById(`${serveur.id}-button`).remove()
            document.getElementById(`${serveur.id}`).remove()
            document.getElementById(`${serveur.id}-temps`).remove()
        }
    }
    
    const fs = require('fs')
    let son = JSON.stringify(listeServeurs, null, 2)
    fs.writeFileSync('data/serveurs-locaux.json', son)
    afficheNomServeur(serveur)
    
}

let supprimerServeurLocal = () => {
    const serveur = listeServeurs
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurEnregistrer").value);

    if (serveur.lancerAuDemarrage === true){
        document.getElementById(`${serveur.id}-button`).remove()
        killProcess(serveur.id)
        document.getElementById(`${serveur.id}`).remove()
        document.getElementById(`${serveur.id}-temps`).remove()
    } 

    log = new Log()
        .type(0)
        .evenement(Log.EVENTS.SUPRESSION)
        .URI(`${serveur.adresse} : ${serveur.port}`)
        .serveur(`${serveur.nomServeur}`)
        .donnees("Supression de " + serveur.nomServeur)
        .save();
    
    listeServeurs = listeServeurs.filter(i => i.id != serveur.id)
    const fs = require('fs')
    let son = JSON.stringify(listeServeurs, null, 2)
    fs.writeFileSync('data/serveurs-locaux.json', son)
    afficheNomServeur()    
}

//Liste des terminaux
let terminalData = [];

let lancerServeur = (infos) => {
    let listeServeurLance = listeServeurs
        .filter(i => i.lancerAuDemarrage === true)//Liste des serveurs ?? lancer
        .filter(a => document.getElementById(a.id) === null);//Liste des serveurs pas encore lanc??s
    

    if (listeServeurLance.length !== 0) {

        for (serveurLance of listeServeurLance) {

            //Ajout d'une en-t??te
            let p = document.createElement('input')
            p.setAttribute('id', `${serveurLance.id}-button`)
            p.setAttribute('type','button')
            p.setAttribute('value',serveurLance.nomServeur)
            p.setAttribute('onclick', `selectTerminal('${serveurLance.id}')`)
            document.getElementById('nom').appendChild(p)
            
            //Ajout d'un terminal
            let div = document.createElement('div')
            div.setAttribute('id', `${serveurLance.id}`)
            div.setAttribute('hidden', 'true')
            document.getElementById('terminal').appendChild(div)
            
            

            //Ajout d'un temps depuis le lancement
            let ptemps = document.createElement('p')
            ptemps.setAttribute('hidden', 'true')
            ptemps.setAttribute('id',`${serveurLance.id}-temps`)
            document.getElementById('piedDePage').appendChild(ptemps)

            if (terminalData.find(i => i.id === serveurLance.id)=== undefined){
                terminalData.push(createTerminal(serveurLance))
            }else{
                terminalData[terminalData.indexOf(terminalData.find(i => i.id === serveurLance.id))] = createTerminal(serveurLance)
            };
            log = new Log()
                .type(0)
                .evenement(Log.EVENTS.DEMARRAGE)
                .URI(`${serveurLance.adresse} : ${serveurLance.port}`)
                .serveur(`${serveurLance.nomServeur}`)
                .donnees(infos + serveurLance.nomServeur)
                .save();
        }
        selectTerminal(listeServeurLance[listeServeurLance.length - 1].id)
    }
}
