// --- MULTI-LANGUAGE SUPPORT ---
let currentLang = localStorage.getItem('lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateTranslations();
}

function updateTranslations() {
    // Title
    document.getElementById('main-title').textContent = translations[currentLang].title;
    // Intro
    updateIntroText();
    // Global search placeholder
    document.getElementById('global-search').placeholder = translations[currentLang].searchPlaceholder;
    // Buttons (back, close, etc.)
    document.querySelectorAll('.back-btn').forEach(btn => {
        if (btn.closest('.country-section')) {
            btn.textContent = translations[currentLang].backToBreweries;
        } else {
            btn.textContent = translations[currentLang].backToCountries;
        }
    });
}

// --- UPDATE INTRO TEXT FOR TRANSLATIONS ---
function updateIntroText() {
    const introP = document.querySelector('.intro');
    if (!introP) return;
    introP.innerHTML = translations[currentLang].introText
        .replace('{glasses}', beerGlasses.length)
        .replace('{breweries}', Object.keys(breweries).length)
        .replace('{countries}', Object.keys(grouped).length)
        + '<br>' + translations[currentLang].infoLink
        + ' | ' + translations[currentLang].duplicatesLink;
    // Add click handler for the duplicates link to trigger handleURLChange
    const dupLink = introP.querySelector('a[href="#duplicates"]');
    if (dupLink) {
        dupLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.hash = '#duplicates';
            handleURLChange();
        });
    }
    // Log total price of beer glasses on initial load
    const totalPrice = getTotalBeerGlassesPrice(beerGlasses);
    console.log('Total price of beer glasses:', totalPrice);
}

document.getElementById('lang-select').value = currentLang;
document.getElementById('lang-select').addEventListener('change', (e) => {
    setLanguage(e.target.value);
    const activeQuery = document.getElementById('global-search').value;
    if (activeQuery.trim() !== '') {
        renderSearchResults(activeQuery);
    } else {
        handleURLChange();
    }
});
