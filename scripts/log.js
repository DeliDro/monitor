const path = require('path');

Number.prototype.padLeft = function(base,chr) {
    var  len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}

/**
 * @author Deli Dro Kieu (https://github.com/DeliDro)
 * @description Constructeur de log selon le "Design Pattern Builder"
 * La structure du log est telle que
 */
class Log {
    constructor(data = {}) {
        this.data = {
            date: this.getDateTime(),
            type: data.type || "SERVEUR LOCAL",
            evenement: data.evenement || "",
            URI: data.URI || "",
            serveur: data.serveur || "",
            donnees: data.donnees || ""
        }
    }

    /**
     * @returns Date au format "dd-MM-YYYY HH:mm:ss"
     */
    getDateTime() {
        var date = new Date;
        return `${this.getDate(date)} ${this.getTime(date)}`
    }

    /**
     * @returns Date au format "dd-MM-YYYY"
     */
    getDate(date) {
        return [date.getFullYear(), (date.getMonth()+1).padLeft(), date.getDate().padLeft()].join('-');
    }

    /**
     * @returns Date au format "HH:mm:ss"
     */
    getTime(date) {
        return [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft() ].join(':');
    }

    /**
     * @param {0 | 1} type_ 0: "SERVEUR LOCAL" ; 1: "SURVEILLANCE"
     */
    type(type_) {this.data.type = type_ === 0 ? "SERVEUR LOCAL" : (type_ === 1 ? "SURVEILLANCE" : "TYPE INCONNU"); return this;}
    
    /**
     * @param {"INFO" | "ERREUR" | "DEMARRAGE" | "ARRET" | "REDEMARRAGE" | "CREATION" | "MODIFICATION" | "SUPRESSION"} evenement_
     */
    evenement(evenement_) {this.data.evenement = evenement_; return this;}
    
    URI(URI_) {this.data.URI = URI_; return this;}
    
    serveur(serveur_) {this.data.serveur = serveur_; return this;}
    
    donnees(donnees_) {this.data.donnees = donnees_; return this;}

    build() {
        var data = this.data;
        return {
            source: "e-Dip Monitor",
            date: data.date,
            type: data.type,
            evenement: data.evenement,
            URI: data.URI,
            serveur: data.serveur,
            donnees: data.donnees,
        }
    }

    save() {
        return new Promise((resolve, reject) => {
            // Génération de date au format YYYY-MM-dd
            var date = new Date;
            let today = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
    
            // Fichier existant
            const fileName = path.resolve(__dirname, `logs/edipmonitor_${today}.json`);
            
            try {
                if (!this.fileExists(fileName))
                    this.writeJSON(fileName, []);
                
                const logs = this.readJSON(fileName);
                logs.push(this.build());
        
                this.writeJSON(fileName, logs);
                resolve(1);
            } catch (error) {
                reject(error);
            }
        });
    }

    fileExists(filePath) {
        return fs.existsSync(filePath);
    }

    readJSON(filePath) {
        return JSON.parse(fs.readFileSync(filePath));
    }

    writeJSON(filePath, content) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), {encoding: "utf-8"});
    }
}

// Définition des événements
Log.EVENTS = {
    INFO: "INFO",
    ERREUR: "ERREUR",
    DEMARRAGE: "DEMARRAGE",
    ARRET: "ARRET",
    REDEMARRAGE: "REDEMARRAGE",
    CREATION: "CREATION",
    MODIFICATION: "MODIFICATION",
    SUPRESSION: "SUPRESSION"
};

// EXEMPLE D'UTILISATION
// ---------------------
// log = new Log()
//     .type(0)
//     .evenement(Log.EVENTS.CREATION)
//     .URI("192.168.1.12:8800")
//     .serveur("ElasticSearch")
//     .donnees("Données à afficher")
//     .save();
// console.log(log);

module.exports = Log;