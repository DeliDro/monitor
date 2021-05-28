let recupererServeursLocaux = () => {
    const fs = require('fs');
    let fichier = fs.readFileSync('data/serveurs-locaux.json');
    let liste = JSON.parse(fichier);
    listeServeur = liste
    listeSurveillance = liste[1]
    console.log(liste)
}

let recupererSurveillance = () => {
    const fs = require('fs');
    let fichier = fs.readFileSync('data/surveillance.json');
    let liste = JSON.parse(fichier);
    listeSurveillance = liste
    console.log(liste)
}


