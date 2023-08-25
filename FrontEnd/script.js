/** Mettre les images de la galerie de manière dynamique **/
function showGalleryImage(works) {
    for(let work of works){ // work = 1 seul objet, works = l'ensemble des objets
        const gallery = document.querySelector("#gallery")
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");
        
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        figcaptionElement.innerText = work.title;
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
    
        gallery.appendChild(figureElement);
    } 
}
// Montrer les filtres
function showFilters(works){
    const filtersList = [...new Set(works.map(work => work.category.name))];
    const filtersContainer = document.getElementById("filters");
    filtersList.forEach(category => {
        const filterButton = document.createElement("button");
        filterButton.textContent = category;
        filterButton.addEventListener("click", () => filterGalleryByCategory(category, works));
        filtersContainer.appendChild(filterButton);
    });
}

// Afficher les filtres par catégorie
function filterGalleryByCategory(category, works) {
    const filteredWorks = works.filter(work => work.category.name === category);
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; // Effacer les éléments actuels de la galerie
    
    showGalleryImage(filteredWorks);
}

// fonction achronyme de works
async function getWorks(){
    const works = await fetch("http://localhost:5678/api/works") //récupération des éléménts(API et JSON)
    const result = await works.json()
    console.log(result)
    showGalleryImage(result)
    showFilters(result)
  // Si mon utilisateur n'est pas connecté
}

getWorks()

// Sélectionner les éléments nécessaires
const span = document.querySelectorAll("span");
const openModalButton = document.querySelector(".modal-js");
const closeModalButtons = document.querySelectorAll(".js-modal-close");
const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");
const deleteGalleryParagraph = document.querySelector(".modal1 p");
const addPhotoButton = document.querySelector(".js-modal2");
const formPhoto = document.getElementById("form-photo");

// Ouvre la première modal
openModalButton.addEventListener("click", () => {
    modal1.style.display = "block";
});

// Fermer toutes les modales
closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        modal1.style.display = "none";
        modal2.style.display = "none";
    });
});

// Supprime la galerie
deleteGalleryParagraph.addEventListener("click", () => {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = ""; // Supprime le contenu de la galerie
});
// Ouvre la deuxième modal (ajout de photo)
addPhotoButton.addEventListener("click", () => {
    modal2.style.display = "block";
});

// Gére l'envoi du formulaire d'ajout de photo
formPhoto.addEventListener("submit", (e) => {
    e.preventDefault();
    // Ajoute ensuite le code pour gérer l'envoi du formulaire d'ajout de photo
    // N'oublie pas de fermer la modal2 après l'ajout réussi
    // Gérer l'envoi du formulaire d'ajout de photo
formPhoto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const image = document.getElementById("importPhoto").files[0];
    const title = document.getElementById("titre").value;
    const category = document.getElementById("category-select").value;

    // Crée un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            alert("La photo a été ajoutée avec succès !");
            modal2.style.display = "none"; // Fermer la modal après l'ajout
            resetForm(); // Réinitialise le formulaire pour la prochaine utilisation
            getWorks(); // Rafraîchis la galerie pour afficher la nouvelle photo
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de l'ajout de la photo :", errorData.error);
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'ajout de la photo :", error);
    }
});







    modal2.style.display = "none";
});

// Gérer l'envoi du formulaire d'ajout de photo
formPhoto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const image = document.getElementById("importPhoto").files[0];
    const title = document.getElementById("titre").value;
    const category = document.getElementById("category-select").value;

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            alert("La photo a été ajoutée avec succès !");
            modal2.style.display = "none"; // Fermer la modal après l'ajout
            resetForm(); // Réinitialise le formulaire pour la prochaine utilisation
            getWorks(); // Rafraîchis la galerie pour afficher la nouvelle photo
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de l'ajout de la photo :", errorData.error);
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'ajout de la photo :", error);
    }
});






