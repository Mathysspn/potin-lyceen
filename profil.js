/* =========================
   POTIN LYCÉEN
   PROFIL
   ========================= */


/* =========================
   ÉLÉMENTS DE LA PAGE
   ========================= */

const nomProfil =
    document.getElementById("nom-profil");

const pseudoProfil =
    document.getElementById("pseudo-profil");

const classeProfil =
    document.getElementById("classe-profil");

const bioProfil =
    document.getElementById("bio-profil");

const avatarLettre =
    document.getElementById("avatar-lettre");

const nombrePublications =
    document.getElementById("nombre-publications");

const nombreAbonnes =
    document.getElementById("nombre-abonnes");

const nombreAbonnements =
    document.getElementById("nombre-abonnements");

const galeriePublications =
    document.getElementById("galerie-publications");

const profilVide =
    document.getElementById("profil-vide");

const ongletPublications =
    document.getElementById("onglet-publications");

const ongletMentions =
    document.getElementById("onglet-mentions");


/* =========================
   UTILISATEUR CONNECTÉ
   ========================= */

const utilisateur =
    JSON.parse(
        localStorage.getItem("potinLyceenUtilisateur")
    );


/* =========================
   VÉRIFICATION
   ========================= */

if (!utilisateur) {

    alert(
        "❌ Tu dois être connecté pour accéder à ton profil."
    );

    window.location.href = "connexion.html";

} else {

    afficherProfil();

    afficherPublications();

}


/* =========================
   AFFICHER LES INFORMATIONS
   DU PROFIL
   ========================= */

function afficherProfil() {

    const prenom =
        utilisateur.prenom || "";

    const nom =
        utilisateur.nom || "";


    const nomComplet =
        (prenom + " " + nom).trim();


    /* Nom */

    nomProfil.textContent =
        nomComplet || "Utilisateur";


    /* Pseudo */

    pseudoProfil.textContent =
        "@" +
        (utilisateur.pseudo || "utilisateur");


    /* =========================
       INFORMATIONS SELON LE TYPE
       ========================= */

    if (
        utilisateur.type === "eleve" &&
        utilisateur.niveau &&
        utilisateur.numeroClasse
    ) {

        classeProfil.textContent =
            utilisateur.niveau +
            " " +
            utilisateur.numeroClasse;

    }

    else if (
        utilisateur.type === "professeur"
    ) {

        classeProfil.textContent =
            utilisateur.matiere
                ? "Professeur de " +
                  utilisateur.matiere
                : "Professeur";

    }

    else if (
        utilisateur.type === "personnel"
    ) {

        classeProfil.textContent =
            utilisateur.fonction ||
            "Personnel du lycée";

    }

    else {

        classeProfil.textContent =
            "";

    }


    /* =========================
       AVATAR
       ========================= */

    const premiereLettre =
        (prenom || nom || "U").charAt(0);


    avatarLettre.textContent =
        premiereLettre.toUpperCase();


    /* =========================
       BIO
       ========================= */

    bioProfil.textContent =
        utilisateur.bio ||
        "Double clique pour modifier ta bio";


    /* =========================
       STATISTIQUES
       ========================= */

    const publications =
        recupererMesPublications();


    nombrePublications.textContent =
        publications.length;


    nombreAbonnes.textContent =
        utilisateur.abonnes || 0;


    nombreAbonnements.textContent =
        utilisateur.abonnements || 0;

}


/* =========================
   RÉCUPÉRER MES PUBLICATIONS
   ========================= */

function recupererMesPublications() {

    const publications =
        JSON.parse(
            localStorage.getItem(
                "potinLyceenPublications"
            )
        ) || [];


    const nomComplet =
        (
            (utilisateur.prenom || "") +
            " " +
            (utilisateur.nom || "")
        ).trim();


    return publications.filter(
        function(publication) {

            /*
             * Nouvelles publications :
             * utilisation du pseudo.
             */

            const correspondancePseudo =
                publication.auteurPseudo &&
                publication.auteurPseudo ===
                utilisateur.pseudo;


            /*
             * Anciennes publications :
             * utilisation du nom complet.
             */

            const correspondanceAncienne =
                !publication.auteurPseudo &&
                publication.auteur ===
                nomComplet;


            return (
                correspondancePseudo ||
                correspondanceAncienne
            );

        }
    );

}


/* =========================
   AFFICHER MES PUBLICATIONS
   ========================= */

function afficherPublications() {

    const publications =
        recupererMesPublications();


    galeriePublications.innerHTML =
        "";


    galeriePublications.style.display =
        "grid";


    nombrePublications.textContent =
        publications.length;


    /* =========================
       AUCUNE PUBLICATION
       ========================= */

    if (publications.length === 0) {

        profilVide.classList.add(
            "visible"
        );

        return;

    }


    profilVide.classList.remove(
        "visible"
    );


    /* =========================
       AFFICHAGE
       ========================= */

    publications.forEach(
        function(publication) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "publication-profil";


            article.innerHTML = `

                <div class="publication-texte">

                    ${echapperHTML(
                        publication.texte
                    )}

                </div>


                <button
                    type="button"
                    class="bouton-supprimer"
                    data-id="${publication.id}"
                    aria-label="Supprimer la publication">

                    🗑

                </button>

            `;


            galeriePublications.appendChild(
                article
            );

        }
    );


    /* =========================
       BOUTONS SUPPRESSION
       ========================= */

    const boutonsSupprimer =
        galeriePublications.querySelectorAll(
            ".bouton-supprimer"
        );


    boutonsSupprimer.forEach(
        function(bouton) {

            bouton.addEventListener(
                "click",
                function() {

                    const id =
                        Number(
                            bouton.dataset.id
                        );


                    supprimerPublication(id);

                }
            );

        }
    );

}


/* =========================
   SUPPRIMER UNE PUBLICATION
   ========================= */

function supprimerPublication(id) {

    let publications =
        JSON.parse(
            localStorage.getItem(
                "potinLyceenPublications"
            )
        ) || [];


    const publication =
        publications.find(
            function(pub) {

                return pub.id === id;

            }
        );


    if (!publication) {

        return;

    }


    /* =========================
       VÉRIFICATION DU PROPRIÉTAIRE
       ========================= */

    const nomComplet =
        (
            (utilisateur.prenom || "") +
            " " +
            (utilisateur.nom || "")
        ).trim();


    const estMaPublication =
        publication.auteurPseudo ===
            utilisateur.pseudo

        ||

        (
            !publication.auteurPseudo &&
            publication.auteur ===
                nomComplet
        );


    if (!estMaPublication) {

        alert(
            "❌ Tu ne peux pas supprimer cette publication."
        );

        return;

    }


    /* =========================
       CONFIRMATION
       ========================= */

    const confirmation =
        confirm(
            "Voulez-vous vraiment supprimer cette publication ?"
        );


    if (!confirmation) {

        return;

    }


    /* =========================
       SUPPRESSION
       ========================= */

    publications =
        publications.filter(
            function(pub) {

                return pub.id !== id;

            }
        );


    localStorage.setItem(
        "potinLyceenPublications",
        JSON.stringify(publications)
    );


    /* Actualisation */

    afficherProfil();

    afficherPublications();

}


/* =========================
   MODIFIER LA BIO
   DOUBLE-CLIC / DOUBLE-TAP
   ========================= */

let dernierTap =
    0;

let modificationEnCours =
    false;


/* =========================
   OUVRIR L'ÉDITION
   ========================= */

function modifierBio() {

    /* Évite plusieurs champs */

    if (modificationEnCours) {

        return;

    }


    modificationEnCours =
        true;


    const ancienneBio =
        utilisateur.bio ||
        "Double clique pour modifier ta bio";


    const champ =
        document.createElement("textarea");


    champ.id =
        "champ-modification-bio";


    champ.className =
        "champ-modification-bio";


    champ.value =
        ancienneBio;


    champ.maxLength =
        150;


    /* Remplace temporairement la bio */

    bioProfil.replaceWith(
        champ
    );


    champ.focus();


    /* Sélectionner le texte */

    champ.select();


    /* =========================
       SAUVEGARDER
       ========================= */

    let sauvegardeEffectuee =
        false;


    function sauvegarderBio() {

        if (sauvegardeEffectuee) {

            return;

        }


        sauvegardeEffectuee =
            true;


        const nouvelleBio =
            champ.value.trim();


        utilisateur.bio =
            nouvelleBio;


        localStorage.setItem(
            "potinLyceenUtilisateur",
            JSON.stringify(
                utilisateur
            )
        );


        bioProfil.textContent =
            nouvelleBio ||
            "Double clique pour modifier ta bio";


        champ.replaceWith(
            bioProfil
        );


        modificationEnCours =
            false;

    }


    /* =========================
       ANNULER
       ========================= */

    function annulerModification() {

        if (sauvegardeEffectuee) {

            return;

        }


        sauvegardeEffectuee =
            true;


        champ.replaceWith(
            bioProfil
        );


        modificationEnCours =
            false;

    }


    /* =========================
       CLAVIER
       ========================= */

    champ.addEventListener(
        "keydown",
        function(event) {

            /* Entrée = sauvegarder */

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sauvegarderBio();

            }


            /* Échap = annuler */

            if (
                event.key === "Escape"
            ) {

                annulerModification();

            }

        }
    );


    /* =========================
       CLIC AILLEURS
       ========================= */

    champ.addEventListener(
        "blur",
        function() {

            sauvegarderBio();

        }
    );

}


/* =========================
   DOUBLE-CLIC SUR PC
   ========================= */

bioProfil.addEventListener(
    "dblclick",
    function() {

        modifierBio();

    }
);


/* =========================
   DOUBLE-TAP SUR TÉLÉPHONE
   ========================= */

bioProfil.addEventListener(
    "touchend",
    function(event) {

        const maintenant =
            Date.now();


        const tempsEntreLesTaps =
            maintenant -
            dernierTap;


        /*
         * Empêche le double-tap de
         * déclencher le zoom du navigateur.
         */

        if (
            tempsEntreLesTaps > 0 &&
            tempsEntreLesTaps < 400
        ) {

            event.preventDefault();

            modifierBio();

        }


        dernierTap =
            maintenant;

    }
);


/* =========================
   ONGLET PUBLICATIONS
   ========================= */

ongletPublications.addEventListener(
    "click",
    function() {

        ongletPublications.classList.add(
            "actif"
        );

        ongletMentions.classList.remove(
            "actif"
        );


        afficherPublications();

    }
);


/* =========================
   ONGLET MENTIONS
   ========================= */

ongletMentions.addEventListener(
    "click",
    function() {

        ongletMentions.classList.add(
            "actif"
        );

        ongletPublications.classList.remove(
            "actif"
        );


        galeriePublications.innerHTML =
            "";


        galeriePublications.style.display =
            "none";


        profilVide.classList.add(
            "visible"
        );


        profilVide.querySelector(
            "h2"
        ).textContent =
            "Bientôt disponible";


        profilVide.querySelector(
            "p"
        ).textContent =
            "Les publications où tu es identifié apparaîtront ici.";

    }
);


/* =========================
   PROTECTION DU TEXTE
   ========================= */

function echapperHTML(texte) {

    const div =
        document.createElement("div");


    div.textContent =
        texte || "";


    return div.innerHTML;

}