const token = sessionStorage.getItem("token");
if(token === null){
    //Pas connecté
    document.querySelector(".blackboard").style.display = "none";
    document.querySelector(".modif").style.display = "none";
    document.querySelector(".modal-js").style.display = "none";
    document.querySelector("#logout").classList.add("invisible")
    document.querySelector("#login").classList.remove("invisible")
} else {
    // Je suis connecté
    document.querySelector("#login").classList.add("invisible")
    document.querySelector("#logout").classList.remove("invisible")
}

const logout = document.querySelector("#logout")
logout.addEventListener("click", () => {
    sessionStorage.removeItem("token")
    Window.reload()
})

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

// Fonction pour récupérer les œuvres depuis l'API et afficher la galerie
async function getWorks(){
    const works = await fetch("http://localhost:5678/api/works") //récupération des éléménts(API et JSON)
    const result = await works.json()
    showGalleryImage(result)
    showGalleryModalImage(result)
    showFilters(result)

}

getWorks() // Appel initial pour récupérer et afficher les œuvres

// Fonction pour afficher les images de la galerie modale
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

// Fonction pour afficher les filtres par catégorie
function showFilters(works){
    const filtersList = [...new Set(works.map(work => work.category.name))];
    const filtersContainer = document.getElementById("filters");
    filtersContainer.textContent = ""
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
// Fonction pour filtrer la galerie par catégorie
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
    const modal2 = document.querySelector(".modal2");
    modal2.style.display = "flex";
}); 

function formValidation() {
    const image = document.getElementById("importPhoto").files[0];
    const title = document.getElementById("titre").value;
    const category = document.getElementById("category-select").value;
    const buttonPhoto = document.querySelector("#submit-photo");

    let myRegex = /^[a-zA-Z-\s]+$/;
    if ((titre === "") || (category === "") || (image === undefined) || myRegex.test(titre)) {
        buttonPhoto.classList.remove("green");
        buttonPhoto.classList.add("grey");
        return false
    } else {
        buttonPhoto.classList.remove("grey")
        buttonPhoto.classList.add("green")
        return true
    }
}

// On rajoute les evenement de test de validation d'un formulaire
const inputPhoto= document.getElementById("importPhoto")
inputPhoto.addEventListener("change", formValidation)

const inputTitle = document.getElementById("titre")
inputTitle.addEventListener("change", formValidation)

const inputCategory = document.getElementById("category-select")
inputCategory.addEventListener("change", formValidation)

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
    const buttonPhoto = document.querySelector(".js-modal2");

    if(formValidation()){
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
                const workInsered = await response.json()
                modal2.style.display = "none";
                document.querySelector("#form-photo").reset();
                getWorks();

            } else {
                const errorData = await response.json();
                console.error("Erreur lors de l'ajout de la photo :", errorData.error);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'ajout de la photo :", error);
        }
    }
});

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



  // Choisir une image sur le clic bouton
const importPhoto = document.querySelector("#importPhoto");
importPhoto.addEventListener("change", previewFile);

function previewFile() {
    const file_extension_regex = /\.(jpg|png)$/i;
    if (this.files.length == 0 || !file_extension_regex.test(this.files[0].name)) {
    return;
    }

    const file = this.files[0];
    const file_reader = new FileReader();
    file_reader.readAsDataURL(file);
    file_reader.addEventListener("load", (e) => displayImage(e, file));
}

function displayImage(event, file) {
    const modalAjoutPhoto = document.querySelector(".modal-ajout-photo");
    modalAjoutPhoto.innerHTML = "";
    const photo = document.createElement("img");
    photo.classList.add("photoChoose");
    photo.src = event.target.result;
    modalAjoutPhoto.appendChild(photo);
}

