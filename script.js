const form = document.getElementById("studentForm");

const studentList = document.getElementById("studentList");

const totalStudents =
    document.getElementById("totalStudents");

const deleteAllBtn =
    document.getElementById("deleteAllBtn");


// =====================================================
// URL GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
    "TON_URL_GOOGLE_APPS_SCRIPT";


// =====================================================
// RECUPERATION DES ETUDIANTS
// =====================================================

let students =
    JSON.parse(localStorage.getItem("students")) || [];


// =====================================================
// AFFICHER LES ETUDIANTS
// =====================================================

function afficherEtudiants() {

    studentList.innerHTML = "";

    students.forEach((student, index) => {

        const card =
            document.createElement("div");

        card.className = "student-card";

        card.innerHTML = `

            <div>

                <h3>
                    👨‍🎓 ${student.nom}
                </h3>

                <p>
                    <strong>Âge :</strong>
                    ${student.age} ans
                </p>

                <p>
                    <strong>Filière :</strong>
                    ${student.filiere}
                </p>

            </div>

            <button
                class="btn-delete"
                onclick="supprimerEtudiant(${index})"
            >
                🗑️ Supprimer
            </button>

        `;

        studentList.appendChild(card);

    });

    totalStudents.textContent =
        students.length;
}


// =====================================================
// AJOUTER UN ETUDIANT
// =====================================================

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nom =
        document.getElementById("nom").value.trim();

    const age =
        document.getElementById("age").value;

    const filiere =
        document.getElementById("filiere").value;


    const etudiant = {

        type: "etudiant",

        nom: nom,

        age: age,

        filiere: filiere

    };


    // Sauvegarde locale

    students.push(etudiant);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    afficherEtudiants();


    // Envoi Google Sheets

    try {

        await fetch(
            GOOGLE_SCRIPT_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify(etudiant)
            }
        );

        alert(
            "✅ Étudiant ajouté avec succès !\n\n" +
            "Les données ont été envoyées vers Google Sheets."
        );

    }

    catch(error) {

        console.error(error);

        alert(
            "⚠️ Étudiant enregistré localement.\n" +
            "Vérifie la configuration Google Sheets."
        );

    }


    form.reset();

});


// =====================================================
// SUPPRIMER UN ETUDIANT
// =====================================================

function supprimerEtudiant(index) {

    if (
        confirm(
            "Voulez-vous supprimer cet étudiant ?"
        )
    ) {

        students.splice(index, 1);

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        afficherEtudiants();

    }

}


// =====================================================
// SUPPRIMER TOUS
// =====================================================

deleteAllBtn.addEventListener(
    "click",
    function() {

        if (students.length === 0) {

            alert(
                "Il n'y a aucun étudiant."
            );

            return;

        }


        if (
            confirm(
                "Voulez-vous supprimer tous les étudiants ?"
            )
        ) {

            students = [];

            localStorage.setItem(
                "students",
                JSON.stringify(students)
            );

            afficherEtudiants();

        }

    }
);


// =====================================================
// WHATSAPP
// =====================================================

document
    .getElementById("whatsappLink")
    .addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            const numero =
                "257XXXXXXXX";

            const message =
                "Bonjour, je vous contacte depuis mon application de gestion des étudiants.";

            const url =
                "https://wa.me/" +
                numero +
                "?text=" +
                encodeURIComponent(message);

            window.open(
                url,
                "_blank"
            );

        }
    );


// =====================================================
// AFFICHAGE INITIAL
// =====================================================

afficherEtudiants();
