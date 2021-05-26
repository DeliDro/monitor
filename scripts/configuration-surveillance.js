let listeNSurveillanceAfficher = document.getElementsByClassName('nomSurveillance')


function afficheNomSurveillance() {
    let b = listeSurveillance
    for (let texte of listeNSurveillanceAfficher) {
        b = b.filter(i=> i.nomServeur != texte.innerHTML);
    }
    for (let serveur of b) {
        //ajout du nom du serveur
        let div = document.createElement("div");
        div.setAttribute('class', 'nomSurveillance');
        div.setAttribute('onclick', 'show("listeNomServeurSurveiller")');
        div.innerHTML = serveur.nomServeur;
        div.addEventListener('click', function(){ afficheInfoSurveillance(serveur)}, false);
        document.getElementById('listeNomServeurSurveiller').appendChild(div);
        //ajout de la bordure
        let bord = document.createElement("div");
        bord.setAttribute('class', 'ligneEspace');
        document.getElementById('listeNomServeurSurveiller').appendChild(bord)
    }

}

function afficheInfoSurveillance(objetServeur) {
        document.getElementById("serveurSurveiller").value = objetServeur.nomServeur
        document.getElementById("addressSurveiller").value = objetServeur.adresse
        document.getElementById("portSurveiller").value = objetServeur.port
        document.getElementById("minSurveiller").value = objetServeur.min
        document.getElementById("secSurveiller").value = objetServeur.sec
    }




