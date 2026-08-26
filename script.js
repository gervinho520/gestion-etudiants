// ===== GESTION DES ÉTUDIANTS =====
// Toutes les données sont stockées dans un tableau

let etudiants = [];
let editIndex = -1; // -1 signifie que nous ne sommes pas en mode édition

// Récupération des éléments du DOM
const form = document.getElementById('studentForm');
const nomInput = document.getElementById('nom');
const ageInput = document.getElementById('age');
const filiereSelect = document.getElementById('filiere');
const studentListDiv = document.getElementById('studentList');
const totalSpan = document.getElementById('totalStudents');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const submitBtn = document.getElementById('submitBtn');

// ===== CHARGEMENT DES DONNÉES DEPUIS localStorage =====
function chargerDonnees() {
    const donnees = localStorage.getItem('etudiants');
    if (donnees) {
        try {
            etudiants = JSON.parse(donnees);
            console.log('✅ Données chargées :', etudiants);
        } catch (e) {
            console.error('❌ Erreur de chargement :', e);
            etudiants = [];
        }
    } else {
        console.log('📭 Aucune donnée en localStorage');
        etudiants = [];
    }
    afficherEtudiants();
}

// ===== SAUVEGARDE DANS localStorage =====
function sauvegarderDonnees() {
    try {
        localStorage.setItem('etudiants', JSON.stringify(etudiants));
        console.log('💾 Données sauvegardées :', etudiants);
    } catch (e) {
        console.error('❌ Erreur de sauvegarde :', e);
    }
}

// ===== AFFICHER LA LISTE DES ÉTUDIANTS =====
function afficherEtudiants() {
    console.log('📋 Affichage de la liste, nombre d\'étudiants :', etudiants.length);
    
    // Mise à jour du compteur
    totalSpan.textContent = etudiants.length;

    if (etudiants.length === 0) {
        studentListDiv.innerHTML = `
            <div class="empty-message">
                📭 Aucun étudiant enregistré<br>
                <span style="font-size: 0.9rem; color: #bbb;">Ajoutez votre premier étudiant !</span>
            </div>
        `;
        return;
    }

    // Génération des cartes
    let html = '';
    etudiants.forEach((etudiant, index) => {
        html += `
            <div class="student-card">
                <div class="info">
                    <div class="nom">${escapeHtml(etudiant.nom)}</div>
                    <div class="age">🎂 ${etudiant.age} ans</div>
                    <div class="filiere">📖 ${escapeHtml(etudiant.filiere)}</div>
                </div>
                <div class="actions">
                    <button class="btn-edit" onclick="modifierEtudiant(${index})">✏️ Modifier</button>
                    <button class="btn-delete" onclick="supprimerEtudiant(${index})">🗑️ Supprimer</button>
                </div>
            </div>
        `;
    });

    studentListDiv.innerHTML = html;
    console.log('✅ Liste affichée avec succès');
}

// ===== FONCTION DE SÉCURISATION (anti-XSS) =====
function escapeHtml(texte) {
    if (!texte) return '';
    const div = document.createElement('div');
    div.textContent = texte;
    return div.innerHTML;
}

// ===== AJOUTER UN ÉTUDIANT =====
function ajouterEtudiant(nom, age, filiere) {
    console.log('🔄 Tentative d\'ajout :', {nom, age, filiere});
    
    // Validation
    if (!nom || !age || !filiere) {
        alert('⚠️ Veuillez remplir tous les champs !');
        return false;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        alert('⚠️ L\'âge doit être entre 1 et 120 ans !');
        return false;
    }

    // Ajout au tableau
    const nouvelEtudiant = {
        nom: nom.trim(),
        age: ageNum,
        filiere: filiere
    };
    
    etudiants.push(nouvelEtudiant);
    console.log('✅ Étudiant ajouté :', nouvelEtudiant);
    
    sauvegarderDonnees();
    afficherEtudiants();
    return true;
}

// ===== MODIFIER UN ÉTUDIANT =====
function modifierEtudiant(index) {
    console.log('✏️ Modification de l\'étudiant index :', index);
    const etudiant = etudiants[index];
    
    if (!etudiant) {
        alert('❌ Étudiant non trouvé !');
        return;
    }
    
    // Remplir le formulaire avec les données existantes
    nomInput.value = etudiant.nom;
    ageInput.value = etudiant.age;
    filiereSelect.value = etudiant.filiere;

    // Changer le bouton
    submitBtn.textContent = '🔄 Mettre à jour';
    submitBtn.classList.add('btn-update');

    // Stocker l'index de l'étudiant en cours d'édition
    editIndex = index;
    
    // Faire défiler vers le formulaire
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// ===== METTRE À JOUR UN ÉTUDIANT =====
function mettreAJourEtudiant(index, nom, age, filiere) {
    console.log('🔄 Mise à jour de l\'étudiant index :', index);
    
    if (!nom || !age || !filiere) {
        alert('⚠️ Veuillez remplir tous les champs !');
        return false;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        alert('⚠️ L\'âge doit être entre 1 et 120 ans !');
        return false;
    }

    etudiants[index] = {
        nom: nom.trim(),
        age: ageNum,
        filiere: filiere
    };

    console.log('✅ Étudiant mis à jour :', etudiants[index]);
    sauvegarderDonnees();
    afficherEtudiants();
    return true;
}

// ===== SUPPRIMER UN ÉTUDIANT =====
function supprimerEtudiant(index) {
    console.log('🗑️ Suppression de l\'étudiant index :', index);
    const nom = etudiants[index]?.nom || 'cet étudiant';
    
    if (confirm(`Voulez-vous vraiment supprimer "${nom}" ?`)) {
        etudiants.splice(index, 1);
        sauvegarderDonnees();
        afficherEtudiants();
        console.log('✅ Étudiant supprimé');
    }
}

// ===== SUPPRIMER TOUS LES ÉTUDIANTS =====
function supprimerTous() {
    if (etudiants.length === 0) {
        alert('📭 La liste est déjà vide !');
        return;
    }

    if (confirm('⚠️ Voulez-vous vraiment supprimer TOUS les étudiants ?')) {
        etudiants = [];
        sauvegarderDonnees();
        afficherEtudiants();
        console.log('🗑️ Tous les étudiants supprimés');
    }
}

// ===== RÉINITIALISER LE FORMULAIRE =====
function reinitialiserFormulaire() {
    console.log('🔄 Réinitialisation du formulaire');
    form.reset();
    submitBtn.textContent = '➕ Ajouter l\'étudiant';
    submitBtn.classList.remove('btn-update');
    editIndex = -1;
}

// ===== GESTION DE LA SOUMISSION DU FORMULAIRE =====
form.addEventListener('submit', function(e) {
    e.preventDefault(); // IMPORTANT : Empêche le rechargement de la page
    console.log('📤 Formulaire soumis');

    const nom = nomInput.value.trim();
    const age = ageInput.value;
    const filiere = filiereSelect.value;

    console.log('📝 Données du formulaire :', {nom, age, filiere});

    if (editIndex === -1) {
        // Mode ajout
        if (ajouterEtudiant(nom, age, filiere)) {
            reinitialiserFormulaire();
        }
    } else {
        // Mode édition
        if (mettreAJourEtudiant(editIndex, nom, age, filiere)) {
            reinitialiserFormulaire();
        }
    }
});

// ===== SUPPRIMER TOUS =====
deleteAllBtn.addEventListener('click', supprimerTous);

// ===== CHARGEMENT INITIAL =====
console.log('🚀 Application démarrée');
chargerDonnees();

// ===== ASTUCE : Raccourci clavier pour réinitialiser =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && editIndex !== -1) {
        reinitialiserFormulaire();
        alert('✅ Mode édition annulé');
        console.log('🔴 Mode édition annulé (Escape)');
    }
});

// ===== TEST : Ajouter des exemples au démarrage si vide =====
// Décommentez les lignes ci-dessous pour avoir des exemples automatiquement
/*
if (etudiants.length === 0) {
    console.log('📦 Ajout d\'exemples automatiques');
    etudiants.push(
        { nom: 'Alice Martin', age: 20, filiere: 'Informatique' },
        { nom: 'Bob Dupont', age: 22, filiere: 'Mathématiques' },
        { nom: 'Claire Durand', age: 19, filiere: 'Biologie' }
    );
    sauvegarderDonnees();
    afficherEtudiants();
}
*/