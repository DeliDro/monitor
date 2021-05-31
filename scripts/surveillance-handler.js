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
function timeit(from = 0, elementID) {
    let m = Math.floor(from / 60);
    let s = from - m * 60;

    let temps = { m, s };

    const f = (t) => t < 10 ? "0" + t : t

    setInterval(() => {
        temps.s += 1;
        if (temps.s === 60) {
            temps.s = 0;
            temps.m += 1;
        }

        document.getElementById(elementID).innerHTML = `Vérifié il y a ${f(temps.m)} min ${f(temps.s)} s`;
    }, 1000);
}

function afficheListeServeur() {
    let l = []
    let barre = "<div class='border-gray-500 border'></div>"
    for (serveur of listeSurveillances) {
        let a = `<div class="flex mb-2 mt-2">
                    <div id=listeVue class="flex flex-col">
                        <div>${serveur.nomServeur}</div>
                        <div class="flex text-xs">
                            ${serveur.adresse}:${serveur.port}
                        </div>
                    </div>

                    <div class="flex-grow"></div>
                    <!-- Actif inactif -->
                    <div id="actifInactif" class="flex flex-col items-end">
                        <div class="flex items-center">
                            <div class="rounded-full bg-${serveur.actif ? "green" : "red"}-500 w-2 h-2 mr-2"> </div>
                            ${serveur.actif ? "actif" : "inactif"}
                            </div>
                        <div class="flex text-xs" id="${serveur.id}"></div>
                    </div>
                </div>`
        timeit(serveur.lastCheck, serveur.id);
        l.push(a)
    }
    document.getElementById("afficheListeServeur").innerHTML = l.join(barre)
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
        ["actionSurveiller", objetServeur.action, "value"]

    ]

    surveillance.map(surveillance => update(...surveillance));
}

// AJOUT SURVEILLANCE
//modifier pour faire pour suveillance
let listeSurveillances = []

let enregistrerSurveillance = () => {
    if (listeSurveillances.length === 0) {
        let serveurInfos = {
            nomServeur: document.getElementById("serveur1").value,
            adresse: document.getElementById("address1").value,
            port: document.getElementById("port1").value,
            min: document.getElementById("min").value,
            sec: document.getElementById("sec").value,
            action: document.getElementById("action").value
        }
        listeSurveillances.push(serveurInfos)
    } else {
        let b = listeSurveillances
        b = b.filter(i => i.nomServeur == document.getElementById("serveur1").value)
        if (b.length === 0) {
            let serveurInfos = {
                nomServeur: document.getElementById("serveur1").value,
                adresse: document.getElementById("address1").value,
                port: document.getElementById("port1").value,
                min: document.getElementById("min").value,
                sec: document.getElementById("sec").value,
                action: document.getElementById("action").value
            }
            listeSurveillances.push(serveurInfos)
        }
    }
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
        serveur.sec = document.getElementById("secSurveiller").value
    serveur.action = document.getElementById("actionSurveiller").value


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
    const fs = require('fs')
    let son = JSON.stringify(listeSurveillances, null, 2)
    fs.writeFileSync('data/surveillances.json', son)
    console.log(listeSurveillances)
}