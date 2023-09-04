const login = document.querySelector("#login-button");
login.addEventListener("click", function (event) {
    event.preventDefault();

    // Récupérer les données du formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Envoi des données à l'API
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(data => {
        // Vérifier si le token a été correctement renvoyé par l'API
        if (data.token) {
            // Stocker le token d'authentification localement dans la session de l'utilisateur à l'aide de l'API sessionStorage.
            sessionStorage.setItem("token", data.token);
            // Rediriger vers la page d'accueil ("./index.html").
            window.location.href = "./index.html";
        } else {
            // Si le token n'est pas renvoyé ou est vide, afficher une alerte et rediriger vers la page de connexion.
            alert("Email or password incorrect");
            window.location.href = "./login.html";
        }
    })
    .catch(error => {
        // Si la requête échoue pour une raison quelconque, cette partie du code capture l'erreur et l'affiche dans la console.
        console.error("Error:", error);
    });
});