const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const totalStudents = document.getElementById("totalStudents");
const deleteAllBtn = document.getElementById("deleteAllBtn");

const GOOGLE_SCRIPT_URL = "COLLE_ICI_TON_URL_APPS_SCRIPT";

let students = JSON.parse(localStorage.getItem("students")) || [];

function afficherEtudiants() {
    studentList.innerHTML = "";

    students.forEach((student, index) => {
        const studentCard = document.createElement("div");
        studentCard.className = "student-card";

        studentCard.innerHTML = `
            <div>
                <h3>${student.nom}</h3>
                <p><strong>Âge :</strong> ${student.age} ans</p>
                <p><strong>Filière :</strong> ${student.filiere}</p>
            </div>

            <button onclick="supprimerEtudiant(${index})">
                🗑️ Supprimer
            </button>
        `;

        studentList.appendChild(studentCard);
    });

    totalStudents.textContent = students.length;
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const age = document.getElementById("age").value;
    const filiere = document.getElementById("filiere").value;

    const etudiant = {
        nom: nom,
        age: age,
        filiere: filiere
    };

    // Enregistrer localement
    students.push(etudiant);
    localStorage.setItem("students", JSON.stringify(students));

    afficherEtudiants();

    // Envoyer vers Google Sheets
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(etudiant)
        });

        const resultat = await response.json();

        if (resultat.success) {
            alert("✅ Étudiant ajouté et enregistré dans Google Sheets !");
        } else {
            alert("⚠️ Étudiant ajouté localement, mais erreur Google Sheets.");
        }

    } catch (error) {
        console.error(error);
        alert("⚠️ Étudiant ajouté localement, mais Google Sheets n'est pas accessible.");
    }

    form.reset();
});

function supprimerEtudiant(index) {
    students.splice(index, 1);

    localStorage.setItem("students", JSON.stringify(students));

    afficherEtudiants();
}

deleteAllBtn.addEventListener("click", function() {

    if (students.length === 0) {
        alert("Aucun étudiant à supprimer.");
        return;
    }

    if (confirm("Voulez-vous vraiment supprimer tous les étudiants ?")) {
        students = [];

        localStorage.setItem("students", JSON.stringify(students));

        afficherEtudiants();
    }
});

afficherEtudiants();
