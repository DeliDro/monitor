function removeItemOnce(arr, value) { 
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

let listeServeur=[]

let enregistrerServeurLocal = () => {
    if(listeServeur.length===0){
        let serveurInfos = {
        nomServeur: document.getElementById("serveur").value,
        adresse: document.getElementById("address").value,
        port : document.getElementById("port").value,
        lancerAuDemarrage : document.getElementById("lancerAuDemarrage").checked,
        fichier : document.getElementById("fichier").value
    }
    listeServeur.push(serveurInfos)
    }else{
        let b=listeServeur
        b=b.filter(i=>i.nomServeur==document.getElementById("serveur").value)
        if (b.length===0){
            let serveurInfos = {
            nomServeur: document.getElementById("serveur").value,
            adresse: document.getElementById("address").value,
            port : document.getElementById("port").value,
            fichier : document.getElementById("fichier").value,
            lancerAuDemarrage : document.getElementById("lancerAuDemarrage").checked
            }
            listeServeur.push(serveurInfos)
        }
    }
    
    console.log(listeServeur);
}

let modifierServeurLocal=()=>{
    const serveur = listeServeur
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurEnregistrer").value);
    
    serveur.nomServeur= document.getElementById("serveurLocal").value;
    serveur.adresse= document.getElementById("addressLocal").value;
    serveur.port = document.getElementById("portLocal").value;
    serveur.fichier = document.getElementById("fichierLocal").value;
    serveur.lancerAuDemarrage = document.getElementById("lancerAuDemarrageLocal").checked
    
    const fs = require('fs')
    let son = JSON.stringify(listeServeur, null, 2)
    fs.writeFileSync('data/serveurs-locaux.json', son)
    console.log(listeServeur)
}

let supprimerServeurLocal = ()=>{
    const serveur = listeServeur
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurEnregistrer").value);
        
    listeServeur=listeServeur.filter(i=> i.id != serveur.id)
    const fs = require('fs')
    let son = JSON.stringify(listeServeur, null, 2)
    fs.writeFileSync('data/serveurs-locaux.json', son)
    console.log(listeServeur)
}




