// IMPORTATION DES MODULES NECESSAIRES
const fs = require('fs');

// FONCTIONS GLOBALES
function getJSONData(file) {
    return JSON.parse(fs.readFileSync(`data/${file}.json`))
}
