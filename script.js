// Liste des numéros WhatsApp bannies (simulation de base de données)
const bannedNumbers = new Set([
    '+212612345678',
    '+212787654321',
    '+212634567890',
    '+212512345678',
    '+212756789012',
    '+1234567890',
    '+447911123456',
    '+33612345678'
]);

// Liste des préfixes pays valides
const validCountryCodes = {
    '+1': 'États-Unis/Canada',
    '+44': 'Royaume-Uni',
    '+33': 'France',
    '+49': 'Allemagne',
    '+39': 'Italie',
    '+34': 'Espagne',
    '+31': 'Pays-Bas',
    '+32': 'Belgique',
    '+212': 'Maroc',
    '+213': 'Algérie',
    '+216': 'Tunisie',
    '+234': 'Nigéria',
    '+254': 'Kenya',
    '+27': 'Afrique du Sud',
    '+55': 'Brésil',
    '+86': 'Chine',
    '+81': 'Japon',
    '+91': 'Inde',
    '+61': 'Australie',
    '+64': 'Nouvelle-Zélande'
};

// Éléments du DOM
const form = document.getElementById('checkerForm');
const phoneInput = document.getElementById('phoneNumber');
const result = document.getElementById('result');
const resultContent = document.getElementById('resultContent');
const loading = document.getElementById('loading');

// Événement du formulaire
form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const phoneNumber = phoneInput.value.trim();
    
    // Validation basique
    if (!phoneNumber) {
        showError('Veuillez entrer un numéro de téléphone');
        return;
    }
    
    // Afficher le chargement
    loading.classList.remove('hidden');
    result.classList.add('hidden');
    
    // Simuler un délai réseau
    setTimeout(() => {
        checkPhoneNumber(phoneNumber);
        loading.classList.add('hidden');
    }, 1500);
}

function checkPhoneNumber(phoneNumber) {
    // Valider le format du numéro
    const isValid = validatePhoneNumber(phoneNumber);
    
    if (!isValid) {
        showError('Format de numéro invalide. Utilisez le format: +[code_pays][numéro]');
        return;
    }
    
    // Vérifier si le numéro est banni
    const isBanned = bannedNumbers.has(phoneNumber);
    
    // Obtenir le pays
    const country = getCountryFromPhone(phoneNumber);
    
    // Afficher le résultat
    displayResult(phoneNumber, isBanned, country);
}

function validatePhoneNumber(phone) {
    // Vérifier le format: commence par + et contient 10-15 chiffres
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
}

function getCountryFromPhone(phone) {
    // Extraire le code pays
    for (const [code, country] of Object.entries(validCountryCodes)) {
        if (phone.startsWith(code)) {
            return country;
        }
    }
    return 'Pays inconnu';
}

function displayResult(phoneNumber, isBanned, country) {
    result.classList.remove('hidden');
    
    let statusClass, statusText, statusIcon;
    
    if (isBanned) {
        statusClass = 'status-banned';
        statusText = 'BANNI';
        statusIcon = '❌';
    } else {
        statusClass = 'status-valid';
        statusText = 'ACTIF';
        statusIcon = '✅';
    }
    
    const timestamp = new Date().toLocaleString('fr-FR');
    
    resultContent.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong>Numéro:</strong> <code>${phoneNumber}</code>
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Pays:</strong> ${country}
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Statut:</strong> <span class="${statusClass}">${statusIcon} ${statusText}</span>
        </div>
        <div style="font-size: 0.9em; color: #999;">
            <strong>Vérification:</strong> ${timestamp}
        </div>
    `;
    
    // Si banni, ajouter des détails supplémentaires
    if (isBanned) {
        resultContent.innerHTML += `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; color: #e74c3c;">
                <strong>⚠️ Attention:</strong> Ce numéro a été signalé comme banni de WhatsApp.
            </div>
        `;
    }
}

function showError(message) {
    result.classList.remove('hidden');
    resultContent.innerHTML = `
        <div style="color: #e67e22; font-weight: 600;">
            ⚠️ ${message}
        </div>
    `;
}

// Ajouter des exemples de numéros au clic sur le label
phoneInput.addEventListener('click', () => {
    if (!phoneInput.value) {
        phoneInput.placeholder = '+212612345678 (exemple banni) ou +212999999999 (exemple valide)';
    }
});

// Auto-format du numéro quand l'utilisateur tape
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value;
    
    // Garder seulement les chiffres et le +
    value = value.replace(/[^\d+]/g, '');
    
    // S'assurer que le + est au début
    if (value && !value.startsWith('+')) {
        value = '+' + value;
    }
    
    e.target.value = value;
});

console.log('WhatsApp Ban Checker - Version 1.0');
console.log('Numéros bannies pour la démo:', Array.from(bannedNumbers));
