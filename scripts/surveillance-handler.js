// SURVEILLANCES DE SERVEURS
function getSurveillances() {
    listeSurveillances = getJSONData("surveillances");
}

function getSurveillance() {

}

function addSurveillance(data) {

}

function editSurveillance() {

}

function deleteSurveillance(id) {

}

// AUTRES 
let listeTimeIt = []
let listePing = []
let objetDeNotification = {}

function intervalleDePing(surveillance){
    let frequence = (surveillance.min*60+surveillance.sec)*1000
    let monPing = setInterval(() => {
        ping(surveillance)
    }, frequence)
    return {id : surveillance.id, ping :monPing }
}

function compteAReboursPing(surveillance) {
    let temps = timeIt(0, surveillance.id)
    if (listeTimeIt.find(i => i.id === surveillance.id) === undefined) {
        listeTimeIt.push({ id: surveillance.id, temps: temps })
    } else {
        clearInterval(listeTimeIt.find(i => i.id === surveillance.id).temps)
        listeTimeIt[listeTimeIt.
            indexOf(listeTimeIt.
                find(i => i.id === surveillance.id))] = { id: surveillance.id, temps: temps }
    }
}

function timeIt(from = 0, elementID) {
    let m = Math.floor(from / 60);
    let s = from - m * 60;

    let temps = { m, s };

    const f = (t) => t < 10 ? "0" + t : t
    return setInterval(() => {
        temps.s += 1;
        if (temps.s === 60) {
            temps.s = 0;
            temps.m += 1;
        }

        document.getElementById(`${elementID}-surveiller`).innerHTML = `Vérifié il y a ${f(temps.m)} min ${f(temps.s)} s`;
    }, 1000);
}

function modifierPing(surveillance){
    let objetPing = intervalleDePing(surveillance)
    clearInterval(listePing.find(i => i.id === surveillance.id).ping)
    document.getElementById(`${surveillance.id}`).innerHTML = `<div class="flex mb-2 mt-2">
                <div id=listeVue class="flex flex-col">
                    <div>${surveillance.nomServeur}</div>
                    <div class="flex text-xs">
                        ${surveillance.adresse}:${surveillance.port}
                    </div>
                </div>

                <div class="flex-grow"></div>
                <!-- Actif inactif -->
                <div class="flex flex-col items-end">
                    <div class="flex items-center" id="${surveillance.id}-actifInactif"></div>
                        
                    <div class="flex text-xs" id="${surveillance.id}-surveiller"></div>
                </div>
            </div>
            <div class='border-gray-500 border'></div>`
    listePing[listePing.
        indexOf(listePing.
            find(i => i.id === surveillance.id))] = objetPing
    
    objetDeNotification[surveillance.id] = undefined
}

function afficherSurveillance(serveur) {
    let a = `<div id=${serveur.id}>
                <div class="flex mb-2 mt-2">
                <div id=listeVue class="flex flex-col">
                    <div>${serveur.nomServeur}</div>
                    <div class="flex text-xs">
                        ${serveur.adresse}:${serveur.port}
                    </div>
                </div>

                <div class="flex-grow"></div>
                <!-- Actif inactif -->
                <div class="flex flex-col items-end">
                    <div class="flex items-center" id="${serveur.id}-actifInactif"></div>
                        
                    <div class="flex text-xs" id="${serveur.id}-surveiller"></div>
                </div>
            </div>
            <div class='border-gray-500 border'></div>
            </div>`
    ping(serveur)
    listePing.push(intervalleDePing(serveur))
    document.getElementById("afficheListeServeur").innerHTML = document.getElementById("afficheListeServeur").innerHTML + a
}

function faireVerification(surveillance,etat,color) {
    document.getElementById(`${surveillance.id}-actifInactif`).innerHTML = `<div class="rounded-full bg-${color}-500 w-2 h-2 mr-2"> </div>${etat}</div>`
    compteAReboursPing(surveillance)
}
function casDePing(surveillance, etat, color) {
    if (objetDeNotification[surveillance.id] == undefined) {
        objetDeNotification[surveillance.id] = {}
        objetDeNotification[surveillance.id]["compteur"] = 0
        faireVerification(surveillance, etat, color)
        notification(surveillance, etat)
    }
    else {
        if (objetDeNotification[surveillance.id]["etat"] == etat) {
            faireVerification(surveillance, etat, color)
        }
        else {
            faireVerification(surveillance, etat, color)
            notification(surveillance, etat)
        }
    }

    objetDeNotification[surveillance.id]["etat"] = etat
}

function ping(surveillance) {
    const tcpp = require('tcp-ping');
    tcpp.ping({address: surveillance.adresse, port: surveillance.port, attempts: 1}, (err, data) => {
        if (err) {
            casDePing(surveillance, "inactif", "red")
        }
        
        else {
            if (data.avg) {
                casDePing(surveillance, "actif", "green")
            }
            else {
                // Gestion de l'erreur
                casDePing(surveillance,"inactif","red")  
                if (objetDeNotification[surveillance.id]["compteur"] < surveillance.actions.length) {
                    executerAction(surveillance.actions[objetDeNotification[surveillance.id]["compteur"]])
                    objetDeNotification[surveillance.id]["compteur"]++}
                };
                
            }
        }
    )
    
}

function notification(surveillance, etat){
    // notification basique
    const notifier = require('node-notifier');
    const path = require('path');

    notifier.notify(
        {
            title: 'E-Dip Monitor',
            message: `${surveillance.nomServeur} ${etat}`,
            icon: path.join(__dirname, 'assets/logo - carre.jpg'), // Absolute path (doesn't work on balloons)
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        }
    )
}

function executerAction(action) {
    if (fs.existsSync(action.fichier)){
        require('child_process')
        .exec(`cmd /k start ${action.fichier}`)}
    else{
        const notifier = require('node-notifier');
        const path = require('path');

        notifier.notify(
            {
                title: 'E-Dip Monitor',
                message: `${action.fichier} n'existe pas`,
                icon: path.join(__dirname, 'assets/logo - carre.jpg'), // Absolute path (doesn't work on balloons)
                sound: true, // Only Notification Center or Windows Toasters
                wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
            }
        )
    }
}
//  CONFIGURATION SURVEILLANCE
function updateConfigSurveillerView() {
    const serveur = listeSurveillances
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurSurveiller").value);

    afficheInfoSurveillance(serveur);
}

function afficheNomSurveillance() {
    document.getElementById('listeNomServeurSurveiller').innerHTML = ""
    for (let serveur of listeSurveillances) {
        //ajout du nom du serveur
        let div = document.createElement("option");
        div.setAttribute('class', 'nomSurveillance');
        div.innerHTML = serveur.nomServeur;
        document.getElementById('listeNomServeurSurveiller').appendChild(div);
    }
    if (listeSurveillances.length != 0) {
        afficheInfoSurveillance(listeSurveillances[0])
    }
}

function afficheInfoSurveillance(objetServeur) {
    const update = (id, value, attr) => document.getElementById(id)[attr] = value;

    const surveillance = [
        ["serveurSurveiller", objetServeur.nomServeur, "value"],
        ["addressSurveiller", objetServeur.adresse, "value"],
        ["portSurveiller", objetServeur.port, "value"],
        ["minSurveiller", objetServeur.min, "value"],
        ["secSurveiller", objetServeur.sec, "value"]
    ]
    document.getElementById("actionsSurveiller").innerHTML = ""
    
    let i = 0
    for (action of objetServeur.actions){
        let a = `<div class="flex mb-2" id="actionSurveiller-${i}">
                    <p>Action ${i+1}&nbsp;:&nbsp;</p>
                    <select name="actionSurveiller-${i}-1" id="actionSurveiller-${i}-1" 
                        class="focus:outline-none bg-white mr-1 -p-1 border-2 border-gray-500 rounded-lg">
                        <option value = "Pas de réponse">Pas de réponse</option>
                    </select>
                    <input type="text" name="actionSurveiller-${i}-2" id="actionSurveiller-${i}-2" placeholder="Chemin de l'action"
                        class="focus:outline-none focus:border-blue-500 border-2 border-gray-500 pl-2 pr-2 rounded-lg flex-grow"
                        value="${action.fichier}">
                </div>`
        document.getElementById('actionsSurveiller').innerHTML = document.getElementById('actionsSurveiller').innerHTML + a
        i++
    }
    
    surveillance.map(surveillance => update(...surveillance));
    
}

// AJOUT SURVEILLANCE
//modifier pour faire pour surveillance
let listeSurveillances = []

//Ajoute les blocs d'actions
function ajouterAction(lieu, id){
    let nombreDeActions = document.getElementById(id).getElementsByTagName('input').length
    let a = `
        <div class="flex items-center w-full mb-2" id="${lieu}-${nombreDeActions}">
            <p><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M42.7 469.3c0 23.5 19.1 42.7 42.7 42.7h341.3c23.5 0 42.7-19.1 42.7-42.7V192H42.7v277.3zm320-213.3h42.7v192h-42.7V256zm-128 0h42.7v192h-42.7V256zm-128 0h42.7v192h-42.7V256zm384-170.7h-128V42.7C362.7 19.1 343.5 0 320 0H192c-23.5 0-42.7 19.1-42.7 42.7v42.7h-128C9.5 85.3 0 94.9 0 106.7V128c0 11.8 9.5 21.3 21.3 21.3h469.3c11.8 0 21.3-9.5 21.3-21.3v-21.3c.1-11.8-9.4-21.4-21.2-21.4zm-170.7 0H192V42.7h128v42.6z" fill="red"/><rect x="0" y="0" width="512" height="512" fill="rgba(0, 0, 0, 0)" /></svg>&nbsp;:&nbsp;</p>
            <p>Action ${nombreDeActions+1}&nbsp;:&nbsp;</p>
            <select
                name="${lieu}-${nombreDeActions}-1"
                id="${lieu}-${nombreDeActions}-1"
                class="focus:outline-none bg-white mr-1 -p-1 border-2 border-gray-500 rounded-lg"
            >
                <option value = "Pas de réponse">Pas de réponse</option>
            </select>
            
            <input
                type="text"
                name="${lieu}-${nombreDeActions}-2"
                id="${lieu}-${nombreDeActions}-2"
                placeholder="Chemin de l'action"
                class="focus:outline-none focus:border-blue-500 border-2 border-gray-500 pl-2 pr-2 rounded-lg flex-grow"
            >
        </div>
    `
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + a
}
//Supprime les blocs actions ajoutés lors d'une nouvelle ouverture du pop-up
function pop_upSurveillanceInitial(){
    document.getElementById('surveillanceServeurDistant').innerHTML = ajoutSurveillanceInit
    
    
}
//liste des actions rentrer dans un enregistrement
function listeDesActions(lieu,id) {
    let nombreDeActions = document.getElementById(id).getElementsByTagName('input').length
    let actions = []
    for (let index = 0; index < nombreDeActions; index++) {
        console.log(index)
        actions.push({ action: document.getElementById(`${lieu}-${index}-1`).value, fichier: document.getElementById(`${lieu}-${index}-2`).value})
    }
    actions = actions.filter(i => i.fichier !=="")
    
    return actions
    
}

let enregistrerSurveillance = () => {
    let serveurInfos
    if (listeSurveillances.length === 0) {
        serveurInfos = {
            id: "sv-0" + listeSurveillances.length,
            nomServeur: document.getElementById("serveur1").value,
            adresse: document.getElementById("address1").value,
            port: document.getElementById("port1").value,
            min: document.getElementById("min").value,
            sec: document.getElementById("sec").value,
            actions : listeDesActions('action', 'actions')
        }
        listeSurveillances.push(serveurInfos)
    } else {
        let b = listeSurveillances
        b = b.filter(i => i.nomServeur == document.getElementById("serveur1").value)
        if (b.length === 0) {
            serveurInfos = {
                id : "sv-0" +listeSurveillances.length,
                nomServeur: document.getElementById("serveur1").value,
                adresse: document.getElementById("address1").value,
                port: document.getElementById("port1").value,
                min: document.getElementById("min").value,
                sec: document.getElementById("sec").value,
                actions: listeDesActions('action', 'actions')
            }
            listeSurveillances.push(serveurInfos)
        }
    }
    afficherSurveillance(serveurInfos)
    const fs = require('fs')
    let son = JSON.stringify(listeSurveillances, null, 2)
    fs.writeFileSync('data/surveillances.json', son)
    console.log(listeSurveillances)
}

let modifierSurveillance = () => {
    const serveur = listeSurveillances
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurSurveiller").value);
    console.log(serveur)
    serveur.nomServeur = document.getElementById("serveurSurveiller").value,
    serveur.adresse = document.getElementById("addressSurveiller").value,
    serveur.port = document.getElementById("portSurveiller").value,
    serveur.min = document.getElementById("minSurveiller").value,
    serveur.sec = document.getElementById("secSurveiller").value,
    serveur.actions = listeDesActions('actionSurveiller','actionsSurveiller')

    modifierPing(serveur)
    const fs = require('fs')
    let son = JSON.stringify(listeSurveillances, null, 2)
    fs.writeFileSync('data/surveillances.json', son)
    console.log(listeSurveillances)
    afficheNomSurveillance()
}

let supprimerSurveillance = () => {
    const serveur = listeSurveillances
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurSurveiller").value);
    console.log(serveur)
    listeSurveillances = listeSurveillances.filter(i => i.id != serveur.id)
    clearInterval(listePing.find(i => i.id === serveur.id).ping)
    clearInterval(listeTimeIt.find(i => i.id === serveur.id).temps)
    document.getElementById(`${serveur.id}`).remove()
    const fs = require('fs')
    let son = JSON.stringify(listeSurveillances, null, 2)
    fs.writeFileSync('data/surveillances.json', son)
    console.log(listeSurveillances)
    afficheNomSurveillance()
}




