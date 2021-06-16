function casDePing(surveillance, etat, color) {
    if (objetDeNotification[surveillance.id] == undefined) {
        objetDeNotification[surveillance.id] = {}
        objetDeNotification[surveillance.id]["compteur"] = 0
        faireVerification(surveillance, etat, color)
        notification(surveillance, etat)
    } 
    else {
        if (objetDeNotification[surveillance.id]["etat"] == etat){
            faireVerification(surveillance, etat, color)
        }
        else{
            faireVerification(surveillance, etat, color)
            notification(surveillance, etat)
        }
    }

    objetDeNotification[surveillance.id]["etat"] = etat
}


/*
objetDeNotification = {
    id:{
        etat : actif/inactif
        compteur : number
    }
}

*/