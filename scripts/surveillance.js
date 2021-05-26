function timeit(from = 0, elementID) {
    let m = Math.floor(from/60);
    let s = from - m*60 ;

    let temps = {m, s};

    const f = (t) => t < 10 ? "0" + t : t

    setInterval(() => {
        temps.s += 1;
        if (temps.s === 60) {
            temps.s = 0;
            temps.m += 1;
        }

        document.getElementById(elementID).innerHTML = `Vérifié il y a ${f(temps.m)} min ${f(temps.s)} s`;
    }, 1000);
}

function afficheListeServeur(){
    let l=[]
    let barre = "<div class='border-gray-500 border'></div>"
    for(serveur of listeSurveillance){
        let a=`<div class="flex mb-2 mt-2">
                    <div id=listeVue class="flex flex-col">
                        <div>${serveur.nomServeur}</div>
                        <div class="flex text-xs">
                            ${serveur.adresse}:${serveur.port}
                        </div>
                    </div>

                    <div class="flex-grow"></div>
                    <!-- Actif inactif -->
                    <div id="actifInactif" class="flex flex-col items-end">
                        <div class="flex items-center">
                            <div class="rounded-full bg-${serveur.actif ? "green" : "red"}-500 w-2 h-2 mr-2"> </div>
                            ${serveur.actif ? "actif": "inactif"}
                            </div>
                        <div class="flex text-xs" id="${serveur.id}"></div>
                    </div>
                </div>`
        timeit(serveur.lastCheck, serveur.id);
        l.push(a)
    }
    document.getElementById("afficheListeServeur").innerHTML=l.join(barre)
}
