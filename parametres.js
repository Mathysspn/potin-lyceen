
/* =========================
   POTIN LYCÉEN
   PARAMÈTRES ET RECADRAGE
   ========================= */

const boutonChangerPhoto =
    document.getElementById("bouton-changer-photo");

const fichierPhotoProfil =
    document.getElementById("fichier-photo-profil");

const fenetreRecadrage =
    document.getElementById("fenetre-recadrage");

const canvasRecadrage =
    document.getElementById("canvas-recadrage");

const zoomPhoto =
    document.getElementById("zoom-photo");

const boutonAnnuler =
    document.getElementById("annuler-recadrage");

const boutonValider =
    document.getElementById("valider-recadrage");

const contexte =
    canvasRecadrage.getContext("2d");

let imageChoisie = null;
let echelleBase = 1;
let echelle = 1;
let positionX = 0;
let positionY = 0;
let glissement = null;
let photoEnCours = false;

const TAILLE_CANVAS = 320;
const TAILLE_PHOTO = 256;
const TAILLE_MAX_DONNEES = 450000;


/* =========================
   OUVRIR LA GALERIE
   ========================= */

boutonChangerPhoto.addEventListener("click", function () {
    fichierPhotoProfil.click();
});


/* =========================
   CHOISIR UNE IMAGE
   ========================= */

fichierPhotoProfil.addEventListener("change", function () {
    const fichier = fichierPhotoProfil.files[0];

    if (!fichier) return;

    if (!fichier.type.startsWith("image/")) {
        alert("Choisis un fichier image.");
        fichierPhotoProfil.value = "";
        return;
    }

    if (fichier.size > 10 * 1024 * 1024) {
        alert("Cette image dépasse 10 Mo. Choisis une image plus légère.");
        fichierPhotoProfil.value = "";
        return;
    }

    const lecteur = new FileReader();

    lecteur.onload = function () {
        const image = new Image();

        image.onload = function () {
            imageChoisie = image;

            /* L'image couvre le carré sans être déformée. */

            echelleBase = Math.max(
                TAILLE_CANVAS / image.naturalWidth,
                TAILLE_CANVAS / image.naturalHeight
            );

            zoomPhoto.value = "1";
            echelle = echelleBase;

            positionX =
                (TAILLE_CANVAS - image.naturalWidth * echelle) / 2;

            positionY =
                (TAILLE_CANVAS - image.naturalHeight * echelle) / 2;

            contraindrePosition();
            dessinerPhoto();

            fenetreRecadrage.hidden = false;
            document.body.style.overflow = "hidden";
        };

        image.onerror = function () {
            alert("Impossible d'ouvrir cette image.");
            fichierPhotoProfil.value = "";
        };

        image.src = lecteur.result;
    };

    lecteur.onerror = function () {
        alert("Impossible de lire ce fichier.");
        fichierPhotoProfil.value = "";
    };

    lecteur.readAsDataURL(fichier);
});


/* =========================
   LIMITER LE DÉPLACEMENT
   ========================= */

function contraindrePosition() {
    if (!imageChoisie) return;

    const largeur = imageChoisie.naturalWidth * echelle;
    const hauteur = imageChoisie.naturalHeight * echelle;

    positionX = Math.min(
        0,
        Math.max(TAILLE_CANVAS - largeur, positionX)
    );

    positionY = Math.min(
        0,
        Math.max(TAILLE_CANVAS - hauteur, positionY)
    );
}


/* =========================
   DESSINER L'APERÇU
   ========================= */

function dessinerPhoto() {
    if (!imageChoisie) return;

    contexte.clearRect(
        0,
        0,
        TAILLE_CANVAS,
        TAILLE_CANVAS
    );

    contexte.drawImage(
        imageChoisie,
        positionX,
        positionY,
        imageChoisie.naturalWidth * echelle,
        imageChoisie.naturalHeight * echelle
    );
}


/* =========================
   RÉGLER LE ZOOM
   ========================= */

zoomPhoto.addEventListener("input", function () {
    if (!imageChoisie) return;

    const ancienZoom = echelle;
    const centre = TAILLE_CANVAS / 2;

    /* Conserve le centre de l'image pendant le zoom. */

    const facteur = Number(zoomPhoto.value);
    const nouvelleEchelle = echelleBase * facteur;

    positionX =
        centre - (centre - positionX) * nouvelleEchelle / ancienZoom;

    positionY =
        centre - (centre - positionY) * nouvelleEchelle / ancienZoom;

    echelle = nouvelleEchelle;

    contraindrePosition();
    dessinerPhoto();
});


/* =========================
   DÉPLACER À LA SOURIS
   OU AU DOIGT
   ========================= */

canvasRecadrage.addEventListener("pointerdown", function (event) {
    if (!imageChoisie) return;

    event.preventDefault();

    glissement = {
        x: event.clientX,
        y: event.clientY,
        positionX: positionX,
        positionY: positionY
    };

    canvasRecadrage.setPointerCapture(event.pointerId);
});

canvasRecadrage.addEventListener("pointermove", function (event) {
    if (!glissement) return;

    event.preventDefault();

    const rectangle = canvasRecadrage.getBoundingClientRect();

    const facteurX = TAILLE_CANVAS / rectangle.width;
    const facteurY = TAILLE_CANVAS / rectangle.height;

    positionX =
        glissement.positionX +
        (event.clientX - glissement.x) * facteurX;

    positionY =
        glissement.positionY +
        (event.clientY - glissement.y) * facteurY;

    contraindrePosition();
    dessinerPhoto();
});

function terminerGlissement() {
    glissement = null;
}

canvasRecadrage.addEventListener("pointerup", terminerGlissement);
canvasRecadrage.addEventListener("pointercancel", terminerGlissement);
canvasRecadrage.addEventListener("lostpointercapture", terminerGlissement);


/* =========================
   FERMER SANS ENREGISTRER
   ========================= */

function fermerRecadrage() {
    fenetreRecadrage.hidden = true;
    document.body.style.overflow = "";
    imageChoisie = null;
    glissement = null;
    fichierPhotoProfil.value = "";
}

boutonAnnuler.addEventListener("click", fermerRecadrage);


/* =========================
   VALIDER LE RECADRAGE
   ========================= */

boutonValider.addEventListener("click", function () {
    if (!imageChoisie || photoEnCours) return;

    photoEnCours = true;
    boutonValider.disabled = true;

    try {
        const petitCanvas = document.createElement("canvas");

        petitCanvas.width = TAILLE_PHOTO;
        petitCanvas.height = TAILLE_PHOTO;

        const petitContexte = petitCanvas.getContext("2d");

        petitContexte.drawImage(
            canvasRecadrage,
            0,
            0,
            TAILLE_CANVAS,
            TAILLE_CANVAS,
            0,
            0,
            TAILLE_PHOTO,
            TAILLE_PHOTO
        );

        let photo = petitCanvas.toDataURL("image/jpeg", 0.75);

        if (photo.length > TAILLE_MAX_DONNEES) {
            photo = petitCanvas.toDataURL("image/jpeg", 0.55);
        }

        if (photo.length > TAILLE_MAX_DONNEES) {
            alert("La photo reste trop lourde. Essaie une autre image.");
            return;
        }

        let utilisateur;

        try {
            utilisateur = JSON.parse(
                localStorage.getItem("potinLyceenUtilisateur")
            );
        } catch (erreur) {
            utilisateur = null;
        }

        if (!utilisateur) {
            alert("Tu dois être connecté pour modifier ta photo.");
            window.location.href = "./connexion.html";
            return;
        }

        utilisateur.photoProfil = photo;

        localStorage.setItem(
            "potinLyceenUtilisateur",
            JSON.stringify(utilisateur)
        );

        fermerRecadrage();

        alert("Photo de profil mise à jour !");

    } catch (erreur) {
        alert(
            "Impossible d'enregistrer la photo. Essaie une image plus légère."
        );
    } finally {
        photoEnCours = false;
        boutonValider.disabled = false;
    }
});


/* =========================
   ÉCHAPPEMENT AVEC ÉCHAP
   ========================= */

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !fenetreRecadrage.hidden) {
        fermerRecadrage();
    }
});
