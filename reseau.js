/* =========================
   POTIN LYCÉEN
   RÉSEAU
   ========================= */


/* =========================
   ÉLÉMENTS DE LA PAGE
   ========================= */

const boutonNouvellePublication =
    document.getElementById(
        "bouton-nouvelle-publication"
    );

const filActualite =
    document.querySelector(
        ".fil-actualite"
    );

const boutonProfil =
    document.getElementById(
        "bouton-profil"
    );


/* =========================
   NOUVELLE PUBLICATION
   ========================= */

if (boutonNouvellePublication) {

    boutonNouvellePublication.addEventListener(
        "click",
        function() {

            window.location.href =
                "./publication.html";

        }
    );

}


/* =========================
   ACCÈS AU PROFIL
   ========================= */

if (boutonProfil) {

    boutonProfil.addEventListener(
        "click",
        function() {

            window.location.href =
                "./profil.html";

        }
    );

}


/* =========================
   AFFICHER LES PUBLICATIONS
   ========================= */

function afficherPublications() {

    const publications =
        JSON.parse(
            localStorage.getItem(
                "potinLyceenPublications"
            )
        ) || [];


    if (!filActualite) {

        return;

    }


    filActualite.innerHTML =
        "";


    /* =========================
       AUCUNE PUBLICATION
       ========================= */

    if (publications.length === 0) {

        filActualite.innerHTML = `

            <div class="fil-vide">

                <div class="icone-vide">
                    💬
                </div>

                <h2>
                    Aucun potin pour le moment
                </h2>

                <p>
                    Les publications apparaîtront ici.
                </p>

            </div>

        `;

        return;

    }


    /* =========================
       UTILISATEUR CONNECTÉ
       ========================= */

    const utilisateur =
        JSON.parse(
            localStorage.getItem(
                "potinLyceenUtilisateur"
            )
        );


    const pseudoUtilisateur =
        utilisateur
            ? utilisateur.pseudo
            : null;


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
                "vraie-publication";


            /* =========================
               INFORMATIONS AUTEUR
               ========================= */

            const nomComplet =
                utilisateur
                    ? (
                        (utilisateur.prenom || "") +
                        " " +
                        (utilisateur.nom || "")
                    ).trim()
                    : "";


            /*
             * Cette vérification est conservée
             * pour permettre d'ajouter plus tard
             * des fonctionnalités propres à
             * l'auteur de la publication.
             */

            const estMaPublication =
                (
                    publication.auteurPseudo &&
                    publication.auteurPseudo ===
                    pseudoUtilisateur
                )
                ||
                (
                    !publication.auteurPseudo &&
                    publication.auteur ===
                    nomComplet
                );


            article.innerHTML = `

                <div class="vraie-publication-entete">

                    <div class="vraie-publication-avatar">
                        👤
                    </div>


                    <div class="vraie-publication-nom">

                        <strong>
                            ${echapperHTML(
                                publication.auteur
                            )}
                        </strong>

                        <small>
                            ${afficherDate(
                                publication.date
                            )}
                        </small>

                    </div>

                </div>


                <div class="vraie-publication-texte">

                    ${echapperHTML(
                        publication.texte
                    )}

                </div>

            `;


            filActualite.appendChild(
                article
            );

        }
    );

}


/* =========================
   AFFICHER LA DATE
   ========================= */

function afficherDate(date) {

    if (!date) {

        return "Maintenant";

    }


    const datePublication =
        new Date(date);


    if (
        Number.isNaN(
            datePublication.getTime()
        )
    ) {

        return "Maintenant";

    }


    const maintenant =
        new Date();


    const difference =
        maintenant -
        datePublication;


    const secondes =
        Math.floor(
            difference / 1000
        );


    if (secondes < 60) {

        return "À l'instant";

    }


    const minutes =
        Math.floor(
            secondes / 60
        );


    if (minutes < 60) {

        return (
            "Il y a " +
            minutes +
            " min"
        );

    }


    const heures =
        Math.floor(
            minutes / 60
        );


    if (heures < 24) {

        return (
            "Il y a " +
            heures +
            " h"
        );

    }


    const jours =
        Math.floor(
            heures / 24
        );


    if (jours < 7) {

        return (
            "Il y a " +
            jours +
            " j"
        );

    }


    return datePublication.toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =========================
   PROTECTION DU TEXTE
   ========================= */

function echapperHTML(texte) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texte || "";


    return div.innerHTML;

}


/* =========================
   CHARGEMENT DE LA PAGE
   ========================= */

afficherPublications();