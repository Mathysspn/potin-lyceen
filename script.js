/* =========================
   POTIN LYCÉEN
   Création de compte
   ========================= */


/* =========================
   RÉCUPÉRATION DES ÉLÉMENTS
   ========================= */

const choixCompte =
    document.getElementById("choix-compte");

const formulaire =
    document.getElementById("formulaire-compte");

const boutonRetour =
    document.getElementById("retour");

const typeCompte =
    document.getElementById("typeCompte");


const informationsEleve =
    document.getElementById("informations-eleve");

const informationsProfesseur =
    document.getElementById("informations-professeur");

const informationsPersonnel =
    document.getElementById("informations-personnel");


const niveau =
    document.getElementById("niveau");

const numeroClasse =
    document.getElementById("numeroClasse");

const matiere =
    document.getElementById("matiere");

const fonction =
    document.getElementById("fonction");


/* =========================
   CODE DE L'ÉTABLISSEMENT
   ========================= */

const CODE_ETABLISSEMENT =
    "0934";


/* =========================
   CHOIX DU TYPE DE COMPTE
   ========================= */

const boutonsTypeCompte =
    document.querySelectorAll(".type-compte");


boutonsTypeCompte.forEach(
    function(bouton) {

        bouton.addEventListener(
            "click",
            function() {

                const type =
                    bouton.dataset.type;

                choisirType(type);

            }
        );

    }
);


/* =========================
   AFFICHER LE BON FORMULAIRE
   ========================= */

function choisirType(type) {

    typeCompte.value =
        type;


    choixCompte.style.display =
        "block";

    formulaire.style.display =
        "flex";

    boutonRetour.style.display =
        "block";


    /* =========================
       CACHER LES INFORMATIONS
       ========================= */

    informationsEleve.style.display =
        "none";

    informationsProfesseur.style.display =
        "none";

    informationsPersonnel.style.display =
        "none";


    /* =========================
       DÉSACTIVER LES CHAMPS
       ========================= */

    niveau.required =
        false;

    numeroClasse.required =
        false;

    matiere.required =
        false;

    fonction.required =
        false;


    /* =========================
       ÉLÈVE
       ========================= */

    if (type === "eleve") {

        informationsEleve.style.display =
            "block";

        niveau.required =
            true;

        numeroClasse.required =
            true;

    }


    /* =========================
       PROFESSEUR
       ========================= */

    else if (type === "professeur") {

        informationsProfesseur.style.display =
            "block";

        matiere.required =
            true;

    }


    /* =========================
       PERSONNEL
       ========================= */

    else if (type === "personnel") {

        informationsPersonnel.style.display =
            "block";

        fonction.required =
            true;

    }

}


/* =========================
   RETOUR AU CHOIX
   ========================= */

boutonRetour.addEventListener(
    "click",
    function() {

        formulaire.style.display =
            "none";

        choixCompte.style.display =
            "";

        boutonRetour.style.display =
            "none";

        typeCompte.value =
            "";

    }
);


/* =========================
   CRÉATION DU COMPTE
   ========================= */

formulaire.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        /* =========================
           RÉCUPÉRATION DES DONNÉES
           ========================= */

        const prenom =
            document
                .getElementById("prenom")
                .value
                .trim();


        const nom =
            document
                .getElementById("nom")
                .value
                .trim();


        const pseudo =
            document
                .getElementById("pseudo")
                .value
                .trim();


        const motDePasse =
            document
                .getElementById("motdepasse")
                .value;


        const confirmation =
            document
                .getElementById("confirmation")
                .value;


        const codeLycee =
            document
                .getElementById("codeLycee")
                .value
                .trim();


        /* =========================
           VÉRIFICATION DU CODE
           ========================= */

        if (codeLycee !== CODE_ETABLISSEMENT) {

            alert(
                "❌ Code établissement incorrect.\n\n" +
                "Le code d'inscription fourni n'est pas valide."
            );

            document
                .getElementById("codeLycee")
                .focus();

            return;

        }


        /* =========================
           VÉRIFICATION MOT DE PASSE
           ========================= */

        if (
            motDePasse !==
            confirmation
        ) {

            alert(
                "❌ Les deux mots de passe ne correspondent pas."
            );

            return;

        }


        /* =========================
           RÉCUPÉRATION DES COMPTES
           ========================= */

        const comptes =
            JSON.parse(
                localStorage.getItem(
                    "potinLyceenComptes"
                )
            ) || [];


        /* =========================
           VÉRIFICATION DU PSEUDO
           ========================= */

        const pseudoExiste =
            comptes.some(
                function(compte) {

                    return (
                        compte.pseudo &&
                        compte.pseudo.toLowerCase() ===
                        pseudo.toLowerCase()
                    );

                }
            );


        if (pseudoExiste) {

            alert(
                "❌ Ce nom d'utilisateur est déjà utilisé."
            );

            return;

        }


        /* =========================
           CRÉATION DU COMPTE
           ========================= */

        const compte = {

            id:
                Date.now(),

            type:
                typeCompte.value,

            prenom:
                prenom,

            nom:
                nom,

            pseudo:
                pseudo,

            motDePasse:
                motDePasse,

            codeLycee:
                codeLycee,

            dateCreation:
                new Date().toISOString()

        };


        /* =========================
           INFORMATIONS ÉLÈVE
           ========================= */

        if (
            typeCompte.value ===
            "eleve"
        ) {

            compte.niveau =
                niveau.value;

            compte.numeroClasse =
                numeroClasse.value;

        }


        /* =========================
           INFORMATIONS PROFESSEUR
           ========================= */

        else if (
            typeCompte.value ===
            "professeur"
        ) {

            compte.matiere =
                matiere.value;

        }


        /* =========================
           INFORMATIONS PERSONNEL
           ========================= */

        else if (
            typeCompte.value ===
            "personnel"
        ) {

            compte.fonction =
                fonction.value;

        }


        /* =========================
           ENREGISTREMENT
           ========================= */

        comptes.push(
            compte
        );


        localStorage.setItem(
            "potinLyceenComptes",
            JSON.stringify(
                comptes
            )
        );


        /* =========================
           NE PAS CONNECTER
           AUTOMATIQUEMENT
           ========================= */

        localStorage.removeItem(
            "potinLyceenUtilisateur"
        );


        /* =========================
           MESSAGE
           ========================= */

        alert(
            "🎉 Ton compte Potin Lycéen a été créé !\n\n" +
            "Tu vas maintenant être redirigé vers la page de connexion."
        );


        /* =========================
           REDIRECTION
           ========================= */

        window.location.href =
            "./connexion.html";

    }
);