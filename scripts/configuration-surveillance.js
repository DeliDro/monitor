function updateConfigSurveillerView() {
    const serveur = listeSurveillance
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurSurveiller").value);

    afficheInfoSurveillance(serveur);
}

function afficheNomSurveillance() {
    document.getElementById('listeNomServeurSurveiller').innerHTML=""
    for (let serveur of listeSurveillance) {
        //ajout du nom du serveur
        let div = document.createElement("option");
        div.setAttribute('class', 'nomSurveillance');
        div.innerHTML = serveur.nomServeur;
        document.getElementById('listeNomServeurSurveiller').appendChild(div);
    }
    if (listeSurveillance.length!=0){
        afficheInfoSurveillance(listeSurveillance[0])
    }
}

function afficheInfoSurveillance(objetServeur) {
    const update = (id, value, attr) => document.getElementById(id)[attr] = value;

    const surveillance =[
        ["serveurSurveiller", objetServeur.nomServeur, "value"],
        ["addressSurveiller", objetServeur.adresse, "value"],
        ["portSurveiller", objetServeur.port, "value"],
        ["minSurveiller", objetServeur.min, "value"],
        ["secSurveiller", objetServeur.sec, "value"],
        ["actionSurveiller", objetServeur.action, "value"]

    ]

    surveillance.map(surveillance => update(...surveillance));
}