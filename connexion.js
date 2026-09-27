/* =========================
   POTIN LYCÉEN
   Connexion
   ========================= */

const formulaireConnexion = document.getElementById("formulaire-connexion");

formulaireConnexion.addEventListener("submit", function(event) {
    event.preventDefault();

    const pseudo = document.getElementById("pseudo").value.trim();
    const motDePasse = document.getElementById("motdepasse").value;

    // Récupération des comptes enregistrés
    const comptes = JSON.parse(
        localStorage.getItem("potinLyceenComptes")
    ) || [];

    // Recherche du compte
    const compte = comptes.find(function(compte) {
        return (
            compte.pseudo.toLowerCase() === pseudo.toLowerCase() &&
            compte.motDePasse === motDePasse
        );
    });

    // Aucun compte trouvé
    if (!compte) {
        alert("❌ Nom d'utilisateur ou mot de passe incorrect.");
        return;
    }

    // Enregistrement de l'utilisateur connecté
    localStorage.setItem(
        "potinLyceenUtilisateur",
        JSON.stringify(compte)
    );

    alert("👋 Bienvenue " + compte.prenom + " !");

    // Pour l'instant, retour vers l'accueil
    window.location.href = "profil.html";
});