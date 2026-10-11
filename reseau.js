
/* =========================
   POTIN LYCÉEN
   RÉSEAU
   ========================= */

/* ÉLÉMENTS DE LA PAGE */

const boutonNouvellePublication =
    document.getElementById("bouton-nouvelle-publication");

const filActualite =
    document.querySelector(".fil-actualite");

const boutonProfil =
    document.getElementById("bouton-profil");


/* NAVIGATION */

if (boutonNouvellePublication) {
    boutonNouvellePublication.addEventListener("click", function () {
        window.location.href = "./publication.html";
    });
}

if (boutonProfil) {
    boutonProfil.addEventListener("click", function () {
        window.location.href = "./profil.html";
    });
}


/* =========================
   AFFICHER LES PUBLICATIONS
   ========================= */

function afficherPublications() {
    if (!filActualite) return;

    const publications =
        JSON.parse(
            localStorage.getItem("potinLyceenPublications")
        ) || [];

    const utilisateurConnecte =
        JSON.parse(
            localStorage.getItem("potinLyceenUtilisateur")
        );

    filActualite.innerHTML = "";

    if (publications.length === 0) {
        filActualite.innerHTML = `
            <div class="fil-vide">
                <div class="icone-vide">💬</div>
                <h2>Aucun potin pour le moment</h2>
                <p>Les publications apparaîtront ici.</p>
            </div>
        `;
        return;
    }

    publications.forEach(function (publication) {
        const article = document.createElement("article");
        article.className = "vraie-publication";

        /*
         * Retrouver les informations de l'auteur.
         * Pour l'instant, localStorage ne contient
         * que le compte enregistré sur cet appareil.
         */

        const estAuteurConnecte =
            utilisateurConnecte &&
            (
                (
                    publication.auteurPseudo &&
                    publication.auteurPseudo ===
                        utilisateurConnecte.pseudo
                ) ||
                (
                    !publication.auteurPseudo &&
                    publication.auteur ===
                        (
                            (utilisateurConnecte.prenom || "") +
                            " " +
                            (utilisateurConnecte.nom || "")
                        ).trim()
                )
            );

        const pseudo =
            publication.auteurPseudo ||
            (estAuteurConnecte
                ? utilisateurConnecte.pseudo
                : null);

        const nomAffiche =
            pseudo ||
            publication.auteur ||
            "Utilisateur";

        const photo =
            estAuteurConnecte && utilisateurConnecte.photoProfil
                ? utilisateurConnecte.photoProfil
                : null;

        /* En-tête de la publication */

        const entete = document.createElement("div");
        entete.className = "vraie-publication-entete";

        const avatar = document.createElement("div");
        avatar.className = "vraie-publication-avatar";

        if (photo) {
            const image = document.createElement("img");
            image.src = photo;
            image.alt = "Photo de profil de " + nomAffiche;
            image.className = "photo-auteur-publication";
            avatar.appendChild(image);
        } else {
            avatar.textContent =
                (nomAffiche.charAt(0) || "U").toUpperCase();
        }

        const blocNom = document.createElement("div");
        blocNom.className = "vraie-publication-nom";

        const nom = document.createElement("strong");
        nom.textContent = nomAffiche;

        const date = document.createElement("small");
        date.textContent = afficherDate(publication.date);

        blocNom.appendChild(nom);
        blocNom.appendChild(date);

        entete.appendChild(avatar);
        entete.appendChild(blocNom);

        const texte = document.createElement("div");
        texte.className = "vraie-publication-texte";
        texte.textContent = publication.texte || "";

        article.appendChild(entete);
        article.appendChild(texte);

        filActualite.appendChild(article);
    });
}


/* AFFICHER LA DATE */

function afficherDate(date) {
    if (!date) return "Maintenant";

    const datePublication = new Date(date);

    if (Number.isNaN(datePublication.getTime())) {
        return "Maintenant";
    }

    const secondes = Math.floor(
        (new Date() - datePublication) / 1000
    );

    if (secondes < 60) return "À l'instant";

    const minutes = Math.floor(secondes / 60);
    if (minutes < 60) return "Il y a " + minutes + " min";

    const heures = Math.floor(minutes / 60);
    if (heures < 24) return "Il y a " + heures + " h";

    const jours = Math.floor(heures / 24);
    if (jours < 7) return "Il y a " + jours + " j";

    return datePublication.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


/* CHARGEMENT */

afficherPublications();
