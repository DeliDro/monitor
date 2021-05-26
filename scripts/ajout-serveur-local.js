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
    let b=listeServeur
    b=b.filter(i=>i.nomServeur==document.getElementById("serveurLocal").value)
    removeItemOnce(listeServeur, b[0])
    let serveurInfos = {
        nomServeur: document.getElementById("serveurLocal").value,
        adresse: document.getElementById("addressLocal").value,
        port : document.getElementById("portLocal").value,
        fichier : document.getElementById("fichierLocal").value,
        lancerAuDemarrage : document.getElementById("lancerAuDemarrageLocal").checked
    }
    listeServeur.push(serveurInfos)

    console.log(listeServeur)
}




