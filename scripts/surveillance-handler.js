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


function ping(surveillance) {
    const tcpp = require('tcp-ping');
    tcpp.ping({address: surveillance.adresse, port: surveillance.port, attempts: 1}, (err, data) => {
        if (err) {
            document.getElementById(`${surveillance.id}-actifInactif`).innerHTML = '<div class="rounded-full bg-red-500 w-2 h-2 mr-2"> </div>inactif</div>'
            compteAReboursPing(surveillance)
        }

        else {
            if (data.avg) {
                document.getElementById(`${surveillance.id}-actifInactif`).innerHTML = '<div class="rounded-full bg-green-500 w-2 h-2 mr-2"> </div>actif</div>'    
                compteAReboursPing(surveillance)
            }
            else {
                // Gestion de l'erreur
                document.getElementById(`${surveillance.id}-actifInactif`).innerHTML = '<div class="rounded-full bg-red-500 w-2 h-2 mr-2"> </div>inactif</div>'    
                compteAReboursPing(surveillance)
                
                //notification
                const notifier = require('node-notifier');
                const path = require('path');

                notifier.notify(
                    {
                        title: 'E-Dip Monitor',
                        message: `${surveillance.nomServeur} inactif`,
                        icon: path.join(__dirname, 'IMG_20190918_181919.jpg'), // Absolute path (doesn't work on balloons)
                        sound: true, // Only Notification Center or Windows Toasters
                        wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                    },
                    function (err, response, metadata) {
                        // Response is response from notification
                        // Metadata contains activationType, activationAt, deliveredAt
                    }
                );
            }
        }
    })
    
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
        ["secSurveiller", objetServeur.sec, "value"],
        ["actionSurveiller1", objetServeur.action1, "value"],
        ["actionSurveiller2", objetServeur.action2, "value"],
        ["actionSurveiller3", objetServeur.action3, "value"]
      

    ]

    surveillance.map(surveillance => update(...surveillance));
}

// AJOUT SURVEILLANCE
//modifier pour faire pour surveillance
let listeSurveillances = []

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
            action1: document.getElementById("action1").value,
            action2: document.getElementById("action2").value,
            action3: document.getElementById("action3").value
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
                action1: document.getElementById("action1").value,
                action2: document.getElementById("action2").value,
                action3: document.getElementById("action3").value
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

    serveur.nomServeur = document.getElementById("serveurSurveiller").value,
    serveur.adresse = document.getElementById("addressSurveiller").value,
    serveur.port = document.getElementById("portSurveiller").value,
    serveur.min = document.getElementById("minSurveiller").value,
    serveur.sec = document.getElementById("secSurveiller").value,
    serveur.action1 = document.getElementById("actionSurveiller1").value,
    serveur.action2 = document.getElementById("actionSurveiller2").value,
    serveur.action3 = document.getElementById("actionSurveiller3").value

    modifierPing(serveur)
    const fs = require('fs')
    let son = JSON.stringify(listeSurveillances, null, 2)
    fs.writeFileSync('data/surveillances.json', son)
    console.log(listeSurveillances)
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
}




