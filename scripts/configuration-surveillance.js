let listeNSurveillanceAfficher = document.getElementsByClassName('nomSurveillance')

function updateConfigSurveillerView() {
    const serveur = listeSurveillance
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurSurveiller").value);

    afficheInfoSurveillance(serveur);
}

function afficheNomSurveillance() {
    let b = listeSurveillance
    for (let texte of listeNSurveillanceAfficher) {
        b = b.filter(i=> i.nomServeur != texte.innerHTML);
    }
    for (let serveur of b) {
        //ajout du nom du serveur
        let div = document.createElement("option");
        div.setAttribute('class', 'nomSurveillance');
        div.innerHTML = serveur.nomServeur;
        document.getElementById('listeNomServeurSurveiller').appendChild(div);
    }

    afficheInfoSurveillance(b[0])
}

function afficheInfoSurveillance(objetServeur) {
    const update = (id, value, attr) => document.getElementById(id)[attr] = value;

    const surveillance =[
        ["serveurSurveiller", objetServeur.nomServeur, "value"],
        ["addressSurveiller", objetServeur.adresse, "value"],
        ["portSurveiller", objetServeur.port, "value"],
        ["minSurveiller", objetServeur.min, "value"],
        ["secSurveiller", objetServeur.sec, "value"]

    ]

    surveillance.map(surveillance => update(...surveillance));
}