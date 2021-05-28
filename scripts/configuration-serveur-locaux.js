
let listeNSAfficher=document.getElementsByClassName('nomServeur')
function updateConfigLocalView() {
    const serveur = listeServeur
        .find( serveur => serveur.nomServeur === document.getElementById("listeNomServeurEnregistrer").value);
    
    afficheInfoServeur(serveur);
}

function afficheNomServeur() {
    let b = listeServeur
    for (let texte of listeNSAfficher) {
        b = b.filter(i => i.nomServeur != texte.innerHTML);
    }
    for (let serveur of b) {
        //ajout du nom du serveur
        let div = document.createElement("option");
        div.setAttribute('class', 'nomServeur');
        div.innerHTML = serveur.nomServeur;
        document.getElementById('listeNomServeurEnregistrer').appendChild(div);
    }

    afficheInfoServeur(b[0])
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