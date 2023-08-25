//Sélectionne l'élément du document HTML en utilisant le sélecteur CSS #login-button,ajoute un écouteur d'événements de clic à cet élément
//ensuite  empêche le comportement par défaut associé à l'événement de se produire.

document.querySelector("#login-button").addEventListener("click", function(event){
    event.preventDefault();

    // Récupére les données du formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    // Envoi les données à l'API
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())  //traite la réponse de la requête, convertit la réponse HTTP en un objet JavaScript en utilisant la méthode .json().
    .then(data => {                    // traite les données renvoyées par le serveur
    
    sessionStorage.setItem("token", data.token);//Stocke le token d'authentification localement dans la session de l'utilisateur à l'aide de l'API sessionStorage.

      // Vérifie si le token a été correctement stocké dans sessionStorage. Si c'est le cas, l'utilisateur est redirigé vers la page d'accueil ("./index.html").
    if (sessionStorage.token !== "undefined"){ window.location.href = "./index.html"; }

    //Sinon, l'utilisateur est redirigé vers la page de connexion ("./login.html") avec un message d'alerte indiquant que l'email ou le mot de passe est incorrect.
    else { 
        window.location.href = "./login.html"; 
        alert("Email or password incorrect");
        }
    })

    
    .catch(error => {
    //Si la requête échoue pour une raison quelconque, cette partie du code capture l'erreur et l'affiche dans la console.
        console.error(":", error);
    });
});