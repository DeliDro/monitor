const show = (toShow) => {
    const showables = ["ajoutServeurLocal", "add", "config","listeNomServeurEnregister","listeNomServeurSurveiller"].filter(i => i !== toShow );

    for (const showable of showables) {
        document.getElementById(showable).hidden = true;
    }

    document.getElementById(toShow).hidden = !document.getElementById(toShow).hidden;

};
