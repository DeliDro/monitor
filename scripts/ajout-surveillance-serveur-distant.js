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
    
    console.log(listeSurveillance);
}

let modifierSurveillance = ()=>{
    let b=listeSurveillance
    b=b.filter(i=>i.nomServeur==document.getElementById("serveurSurveiller").value)
    removeItemOnce(listeSurveillance, b[0])
    let serveurInfos = {
        nomServeur: document.getElementById("serveurSurveiller").value,
        adresse: document.getElementById("addressSurveiller").value,
        port : document.getElementById("portSurveiller").value,
        min : document.getElementById("minSurveiller").value,
        sec : document.getElementById("secSurveiller").value
    }
    listeSurveillance.push(serveurInfos)

    console.log(listeSurveillance)
}