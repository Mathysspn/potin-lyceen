/* =========================
   POTIN LYCÉEN
   NOUVELLE PUBLICATION
   ========================= */


/* =========================
   ÉLÉMENTS
   ========================= */

const boutonFermer =
    document.getElementById("bouton-fermer");

const boutonPublier =
    document.getElementById("bouton-publier");

const textePublication =
    document.getElementById("texte-publication");

const boutonEmoji =
    document.getElementById("bouton-emoji");

const menuEmojis =
    document.getElementById("menu-emojis");

const boutonPhoto =
    document.getElementById("bouton-photo");

const boutonVideo =
    document.getElementById("bouton-video");

const boutonHashtag =
    document.getElementById("bouton-hashtag");

const boutonPersonne =
    document.getElementById("bouton-personne");

const boutonConfidentialite =
    document.getElementById("bouton-confidentialite");

const confidentialiteValeur =
    document.getElementById("confidentialite-valeur");


/* =========================
   UTILISATEUR
   ========================= */

const utilisateur =
    JSON.parse(
        localStorage.getItem(
            "potinLyceenUtilisateur"
        )
    );


if (!utilisateur) {

    alert(
        "❌ Tu dois être connecté pour créer une publication."
    );

    window.location.href =
        "./connexion.html";

}


/* =========================
   FERMER
   ========================= */

boutonFermer.addEventListener(
    "click",
    function() {

        window.location.href =
            "./reseau.html";

    }
);


/* =========================
   EMOJIS
   ========================= */

if (boutonEmoji && menuEmojis) {

    boutonEmoji.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            menuEmojis.classList.toggle(
                "ouvert"
            );

        }
    );


    const boutonsEmoji =
        menuEmojis.querySelectorAll(
            "button"
        );


    boutonsEmoji.forEach(
        function(bouton) {

            bouton.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    const emoji =
                        bouton.textContent;


                    /*
                     * Position actuelle du curseur
                     */

                    const debut =
                        textePublication.selectionStart;


                    const fin =
                        textePublication.selectionEnd;


                    const texte =
                        textePublication.value;


                    /*
                     * Insérer l'emoji
                     */

                    textePublication.value =
                        texte.substring(
                            0,
                            debut
                        )
                        +
                        emoji
                        +
                        texte.substring(
                            fin
                        );


                    /*
                     * Replacer le curseur
                     */

                    const nouvellePosition =
                        debut +
                        emoji.length;


                    textePublication.focus();


                    textePublication.setSelectionRange(
                        nouvellePosition,
                        nouvellePosition
                    );


                    /*
                     * Fermer le menu
                     */

                    menuEmojis.classList.remove(
                        "ouvert"
                    );

                }
            );

        }
    );


    /*
     * Cliquer ailleurs ferme le menu
     */

    document.addEventListener(
        "click",
        function() {

            menuEmojis.classList.remove(
                "ouvert"
            );

        }
    );

}


/* =========================
   PUBLIER
   ========================= */

boutonPublier.addEventListener(
    "click",
    function() {

        const texte =
            textePublication.value.trim();


        if (texte === "") {

            alert(
                "✍️ Écris quelque chose avant de publier."
            );

            textePublication.focus();

            return;

        }


        const publications =
            JSON.parse(
                localStorage.getItem(
                    "potinLyceenPublications"
                )
            ) || [];


        const publication = {

            id: Date.now(),

            texte: texte,

            auteur:
                (
                    (utilisateur.prenom || "") +
                    " " +
                    (utilisateur.nom || "")
                ).trim(),

            auteurPseudo:
                utilisateur.pseudo,

            date:
                new Date().toISOString()

        };


        publications.unshift(
            publication
        );


        localStorage.setItem(
            "potinLyceenPublications",
            JSON.stringify(
                publications
            )
        );


        window.location.href =
            "./reseau.html";

    }
);


/* =========================
   PHOTO
   ========================= */

boutonPhoto.addEventListener(
    "click",
    function() {

        alert(
            "📷 L'ajout de photos sera disponible prochainement."
        );

    }
);


/* =========================
   VIDÉO
   ========================= */

boutonVideo.addEventListener(
    "click",
    function() {

        alert(
            "🎥 L'ajout de vidéos sera disponible prochainement."
        );

    }
);


/* =========================
   HASHTAG
   ========================= */

boutonHashtag.addEventListener(
    "click",
    function() {

        const position =
            textePublication.selectionStart;


        const texte =
            textePublication.value;


        textePublication.value =
            texte.substring(
                0,
                position
            )
            +
            "#"
            +
            texte.substring(
                position
            );


        textePublication.focus();


        textePublication.setSelectionRange(
            position + 1,
            position + 1
        );

    }
);


/* =========================
   AJOUTER UNE PERSONNE
   ========================= */

boutonPersonne.addEventListener(
    "click",
    function() {

        alert(
            "👤 L'identification d'une personne sera disponible prochainement."
        );

    }
);


/* =========================
   CONFIDENTIALITÉ
   ========================= */

boutonConfidentialite.addEventListener(
    "click",
    function() {

        if (
            confidentialiteValeur.textContent.trim()
            ===
            "Tout le monde"
        ) {

            confidentialiteValeur.textContent =
                "Mes abonnés";

        }

        else {

            confidentialiteValeur.textContent =
                "Tout le monde";

        }

    }
);