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

function afficheNomServeur() {
    document.getElementById('listeNomServeurEnregistrer').innerHTML = ""
    for (let serveur of listeServeurs) {
        //ajout du nom du serveur
        let div = document.createElement("option");
        div.setAttribute('class', 'nomServeur');
        div.innerHTML = serveur.nomServeur;
        document.getElementById('listeNomServeurEnregistrer').appendChild(div);
    }

    if (listeServeurs.length != 0) {
        afficheInfoServeur(listeServeurs[0])
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

let enregistrerServeurLocal = () => {
    if (listeServeurs.length === 0) {
        let serveurInfos = {
            nomServeur: document.getElementById("nom-serveur-local").value,
            adresse: document.getElementById("address-serveur-local").value,
            port: document.getElementById("port-serveur-local").value,
            lancerAuDemarrage: document.getElementById("lancerAuDemarrage-serveur-local").checked,
            fichier: document.getElementById("fichier-serveur-local").value
        }
        listeServeurs.push(serveurInfos)
    } else {
        let b = listeServeurs
        b = b.filter(i => i.nomServeur == document.getElementById("serveur").value)
        if (b.length === 0) {
            let serveurInfos = {
                nomServeur: document.getElementById("serveur").value,
                adresse: document.getElementById("address").value,
                port: document.getElementById("port").value,
                fichier: document.getElementById("fichier").value,
                lancerAuDemarrage: document.getElementById("lancerAuDemarrage").checked
            }
            listeServeurs.push(serveurInfos)
        }
    }
    const fs = require('fs')
    let son = JSON.stringify(listeServeurs, null, 2)
    fs.writeFileSync('data/serveurs-locaux.json', son)
    console.log(listeServeurs);

    lancerServeur()
}


let modifierServeurLocal = () => {
    const serveur = listeServeurs
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurEnregistrer").value);

    serveur.nomServeur = document.getElementById("serveurLocal").value;
    serveur.adresse = document.getElementById("addressLocal").value;
    serveur.port = document.getElementById("portLocal").value;
    serveur.fichier = document.getElementById("fichierLocal").value;
    serveur.lancerAuDemarrage = document.getElementById("lancerAuDemarrageLocal").checked

    const fs = require('fs')
    let son = JSON.stringify(listeServeurs, null, 2)
    fs.writeFileSync('data/serveurs-locaux.json', son)
    console.log(listeServeurs)
}

let supprimerServeurLocal = () => {
    const serveur = listeServeurs
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurEnregistrer").value);

    listeServeurs = listeServeurs.filter(i => i.id != serveur.id)
    const fs = require('fs')
    let son = JSON.stringify(listeServeurs, null, 2)
    fs.writeFileSync('data/serveurs-locaux.json', son)
    console.log(listeServeurs)
}




let lancerServeur = () => {
    let listeServeurLance = listeServeurs.filter(i => i.lancerAuDemarrage === true);

    if (listeServeurLance.length !== 0) {
        document.getElementById('terminal').innerHTML = "";

        let output = []

        for (serveurLance of listeServeurLance) {
            let p = `
                <input
                    id="${serveurLance.id}-button"
                    type="button" value="${serveurLance.nomServeur}" 
                    class="bg-blue-600 rounded-t-xl text-sm border-r-2 border-white
                    p-1 pl-2 pr-2 text-white font-bold hover:bg-blue-400 ease-in-out duration-100
                    cursor-pointer capitalize focus:outline-none" 
                    onclick="selectTerminal('${serveurLance.id}')"
                >`;

            output.push(p);

            let div = document.createElement('div')
            div.setAttribute('id', `${serveurLance.id}`)
            div.setAttribute('hidden', 'true')
            document.getElementById('terminal').appendChild(div)
            createTerminal(serveurLance)
        }
        selectTerminal(listeServeurLance[listeServeurLance.length - 1].id)
        document.getElementById('nom').innerHTML = output.join("")
    }
}
