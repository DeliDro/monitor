let listeNSAfficher = document.getElementsByClassName('nomServeur')


function afficheNomServeur() {
    let b = listeServeur
    for (let texte of listeNSAfficher) {
        b = b.filter(i=> i.nomServeur != texte.innerHTML);
    }
    for (let serveur of b) {
        //ajout du nom du serveur
        let div = document.createElement("div");
        div.setAttribute('class', 'nomServeur');
        div.setAttribute('onclick', 'show("listeNomServeurEnregister")');
        div.innerHTML = serveur.nomServeur;
        div.addEventListener('click', function(){ afficheInfoServeur(serveur)}, false);
        document.getElementById('listeNomServeurEnregister').appendChild(div);
        //ajout de la bordure
        let bord = document.createElement("div");
        bord.setAttribute('class', 'ligneEspace');
        document.getElementById('listeNomServeurEnregister').appendChild(bord)
    }

}

function afficheInfoServeur(objetServeur) {
        document.getElementById("serveurLocal").value = objetServeur.nomServeur;
        document.getElementById("addressLocal").value = objetServeur.adresse;
        document.getElementById("portLocal").value = objetServeur.port;
        document.getElementById("fichierLocal").value = objetServeur.fichier;
        document.getElementById("lancerAuDemarrageLocal").checked = objetServeur.lancerAuDemarrage
    }
        
        

        

    