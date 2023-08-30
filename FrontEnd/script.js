/** Mettre les images de la galerie de manière dynamique **/
function showGalleryImage(works) {
    const gallery = document.querySelector("#gallery");
    gallery.innerHTML = ""; // Effacer les éléments actuels de la galerie

    for (let work of works) {
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

// fonction anonyme de works
async function getWorks(){
    const works = await fetch("http://localhost:5678/api/works") //récupération des éléménts(API et JSON)
    const result = await works.json()
    console.log(result)
    showGalleryImage(result)
    showGalleryModalImage(result)
    showFilters(result)
  // Si mon utilisateur n'est pas connecté
}

getWorks()

/** Mettre les images de la galerie de manière dynamique dans la modal **/
function showGalleryModalImage(works) {
    const gallery = document.querySelector(".modal-gallery");
    gallery.innerHTML = ""; // Effacer les éléments actuels de la galerie modale
    //document.querySelector('.filter').style.display = 'none';

    for (let work of works) {
        const figureElement = document.createElement("figure");
        figureElement.style.position = "relative"; // Il faudra éventuellement utiliser une classe CSS
        const imageElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");
        figureElement.dataset.workId = work.id; // Stocker l'ID du travail dans le dataset

        // Créer un élément icône de corbeille pour supprimer les images
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");
        trashIcon.addEventListener("click", async function (event) {
            const workId = figureElement.dataset.workId;
            await deleteWork(workId); // Suppression du travail
            figureElement.remove(); // Suppression de l'élément de la galerie modale
        });

        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        figcaptionElement.innerText = "Éditer";
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
        figureElement.appendChild(trashIcon);
        gallery.appendChild(figureElement);
    }
}

// Montre les filtres
function showFilters(works){
    const filtersList = [...new Set(works.map(work => work.category.name))];
    const filtersContainer = document.getElementById("filters");
    const allFilter = document.createElement("button");
    allFilter.textContent = "Tous"
    allFilter.addEventListener("click", () => filterGalleryByCategory("all", works));
    //allFilter.classList.add("btnFilter")
    allFilter.className = "btnFilter"
    filtersContainer.appendChild(allFilter)
    
    filtersList.forEach(category => {
        const filterButton = document.createElement("button");
        filterButton.textContent = category;
        //filterButton.classList.add("btnFilter")
        filterButton.className = "btnFilter"
        filterButton.addEventListener("click", () => filterGalleryByCategory(category, works));
        filtersContainer.appendChild(filterButton);
    });
}
// Affiche les filtres par catégorie
function filterGalleryByCategory(category, works) {
    if(category === "all"){
        const filteredWorks = works;
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = ""; // Effacer les éléments actuels de la galerie
        showGalleryImage(filteredWorks);
    } else {
        const filteredWorks = works.filter(work => work.category.name === category);
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = ""; // Effacer les éléments actuels de la galerie
        showGalleryImage(filteredWorks);
    }
}
// Sélectionne les éléments nécessaires
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
    modal1.style.display = "flex";
});

// Ferme toutes les modales
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
    modal2.style.display = "flex";
}); 


// Gérer l'envoi du formulaire d'ajout de photo
formPhoto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const image = document.getElementById("importPhoto").files[0];
    const title = document.getElementById("titre").value;
    const category = document.getElementById("category-select").value;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            alert("La photo a été ajoutée avec succès !");
            modal2.style.display = "none";
            resetForm();
            getWorks();

            // Modifier le texte du bouton pour indiquer que les photos ont été chargées
            addPhotoButton.textContent = "Photos chargées";
            addPhotoButton.classList.add("photos-loaded");
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de l'ajout de la photo :", errorData.error);
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'ajout de la photo :", error);
    }
});

// suppression d'une œuvre à partir du serveur et de sa visualisation dans la galerie modale.

async function deleteWork(id) {
    try {
        const resultFetch = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });
        if (resultFetch.ok) {
            // Delete the figure from the gallery and delete the figure from the modal
            document.querySelectorAll(`figure[data-work-id="${id}"]`).forEach(figure => {
                figure.parentNode.removeChild(figure);
            });
        }
    } catch (error) {
        alert("Une erreur est survenue lors de la suppression.");
        console.log(error);
    }
}
