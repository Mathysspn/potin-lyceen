
/* =========================
   POTIN LYCÉEN
   PARAMÈTRES
   ========================= */

const boutonChangerPhoto =
    document.getElementById("bouton-changer-photo");

const fichierPhotoProfil =
    document.getElementById("fichier-photo-profil");


/* =========================
   OUVRIR LA GALERIE
   ========================= */

if (boutonChangerPhoto && fichierPhotoProfil) {

    boutonChangerPhoto.addEventListener("click", function () {
        fichierPhotoProfil.click();
    });

}


/* =========================
   CHOISIR ET ENREGISTRER
   LA PHOTO DE PROFIL
   ========================= */

if (fichierPhotoProfil) {

    fichierPhotoProfil.addEventListener("change", function () {

        const fichier = fichierPhotoProfil.files[0];

        if (!fichier) {
            return;
        }

        if (!fichier.type.startsWith("image/")) {
            alert("Choisis un fichier image.");
            fichierPhotoProfil.value = "";
            return;
        }

        /* Limite la taille du fichier original à 10 Mo */

        if (fichier.size > 10 * 1024 * 1024) {
            alert("Cette image dépasse 10 Mo. Choisis une image plus légère.");
            fichierPhotoProfil.value = "";
            return;
        }

        const lecteur = new FileReader();

        lecteur.onload = function () {

            const image = new Image();

            image.onload = function () {

                /* Réduit l'image pour économiser de la place */

                const tailleMax = 256;

                const ratio = Math.min(
                    1,
                    tailleMax / Math.max(
                        image.naturalWidth,
                        image.naturalHeight
                    )
                );

                const canvas = document.createElement("canvas");

                canvas.width = Math.max(
                    1,
                    Math.round(image.naturalWidth * ratio)
                );

                canvas.height = Math.max(
                    1,
                    Math.round(image.naturalHeight * ratio)
                );

                const contexte = canvas.getContext("2d");

                if (!contexte) {
                    alert("Impossible de traiter cette image.");
                    fichierPhotoProfil.value = "";
                    return;
                }

                contexte.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                let photo = canvas.toDataURL("image/jpeg", 0.75);

                if (photo.length > 450000) {
                    photo = canvas.toDataURL("image/jpeg", 0.55);
                }

                if (photo.length > 450000) {
                    alert("Cette image est trop lourde. Essaie une autre photo.");
                    fichierPhotoProfil.value = "";
                    return;
                }

                /* Récupère le compte connecté */

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
                    fichierPhotoProfil.value = "";
                    window.location.href = "./connexion.html";
                    return;
                }

                /* Enregistre la photo sur le compte */

                utilisateur.photoProfil = photo;

                try {

                    localStorage.setItem(
                        "potinLyceenUtilisateur",
                        JSON.stringify(utilisateur)
                    );

                    alert("Photo de profil mise à jour !");

                } catch (erreur) {

                    alert(
                        "Impossible d'enregistrer cette photo. Essaie une image plus légère."
                    );

                    fichierPhotoProfil.value = "";
                    return;

                }

                /* Permet de choisir à nouveau la même image */

                fichierPhotoProfil.value = "";

            };

            image.onerror = function () {
                alert("Impossible d'ouvrir cette image. Essaie un autre fichier.");
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

}
