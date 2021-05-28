//modifier pour faire pour suveillance
let listeSurveillance=[]

let enregistrerSurveillance = () => {
    if(listeSurveillance.length===0){
        let serveurInfos = {
        nomServeur: document.getElementById("serveur1").value,
        adresse: document.getElementById("address1").value,
        port : document.getElementById("port1").value,
        min : document.getElementById("min").value,
        sec : document.getElementById("sec").value
    }
    listeSurveillance.push(serveurInfos)
    }else{
        let b=listeSurveillance
        b=b.filter(i=>i.nomServeur==document.getElementById("serveur1").value)
        if (b.length===0){
            let serveurInfos = {
            nomServeur: document.getElementById("serveur1").value,
            adresse: document.getElementById("address1").value,
            port : document.getElementById("port1").value,
            min : document.getElementById("min").value,
            sec : document.getElementById("sec").value
            }
            listeSurveillance.push(serveurInfos)
        }
    }
    const fs = require('fs')
    let son = JSON.stringify(listeSurveillance, null, 2)
    fs.writeFileSync('data/surveillance.json', son)
    console.log(listeSurveillance)
}

let modifierSurveillance = ()=>{
    const serveur = listeSurveillance
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurSurveiller").value);

        serveur.nomServeur= document.getElementById("serveurSurveiller").value,
        serveur.adresse= document.getElementById("addressSurveiller").value,
        serveur.port = document.getElementById("portSurveiller").value,
        serveur.min = document.getElementById("minSurveiller").value,
        serveur.sec = document.getElementById("secSurveiller").value

    
    const fs = require('fs')
    let son = JSON.stringify(listeSurveillance, null, 2)
    fs.writeFileSync('data/surveillance.json', son)
    console.log(listeSurveillance)
}

let supprimerSurveillance = () => {
    const serveur = listeSurveillance
        .find(serveur => serveur.nomServeur === document.getElementById("listeNomServeurSurveiller").value);
    console.log(serveur)
    listeSurveillance = listeSurveillance.filter(i => i.id != serveur.id)
    const fs = require('fs')
    let son = JSON.stringify(listeSurveillance, null, 2)
    fs.writeFileSync('data/surveillance.json', son)
    console.log(listeSurveillance)
}