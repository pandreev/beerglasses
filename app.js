const beerGlasses = [
    ...glassesBelgium,
    ...glassesBulgaria,
    ...glassesDenmark,
    ...glassesFrance,
    ...germany,
    ...glassesIreland,
    ...glassesNetherlands,
    ...glassesPortugal,
    ...glassesSpain,
    ...glassesSweden,
];

// Map country to flag emoji
const countryFlags = {
    'Austria': '🇦🇹',
    'Belgium': '🇧🇪',
    'Bulgaria': '🇧🇬',
    'Czechia': '🇨🇿',
    'Denmark': '🇩🇰',
    'Estonia': '🇪🇪',
    'France': '🇫🇷',
    'Germany': '🇩🇪',
    'Greece': '🇬🇷',
    'Hungary': '🇭🇺',
    'Ireland': '🇮🇪',
    'Italy': '🇮🇹',
    'Netherlands': '🇳🇱',
    'Poland': '🇵🇱',
    'Portugal': '🇵🇹',
    'Romania': '🇷🇴',
    'Russia': '🇷🇺',
    'Spain': '🇪🇸',
    'Sweden': '🇸🇪',
    'Ukraine': '🇺🇦',
    'United Kingdom': '🇬🇧',
};

// Group by country
const grouped = beerGlasses.reduce((acc, glass) => {
    acc[glass.country] = acc[glass.country] || [];
    acc[glass.country].push(glass);
    return acc;
}, {});
const collectionDiv = document.getElementById('collection');

const countryContinents = {
    "Bulgaria": "Europe",
    "Belgium": "Europe",
    "Denmark": "Europe",
    "France": "Europe",
    "Germany": "Europe",
    "Ireland": "Europe",
    "Portugal": "Europe",
    "Netherlands": "Europe",
    "Spain": "Europe",
    "Sweden": "Europe",
};

const continentOrder = ["Europe", "North America", "Asia", "South America", "Africa", "Oceania"];

function getBreweryImage(breweryName) {
    return breweries[breweryName] || 'breweries/img/default.png';
}

function renderCountries() {
    updateURL();
    document.querySelector('.intro').style.display = 'block';
    collectionDiv.innerHTML = '';
    // Group countries by continent
    const continentGroups = {};
    Object.keys(grouped).forEach(country => {
        const continent = countryContinents[country] || "Other";
        if (!continentGroups[continent]) continentGroups[continent] = [];
        continentGroups[continent].push(country);
    });

    continentOrder.forEach(continent => {
        if (!continentGroups[continent]) return;
        const section = document.createElement('div');
        section.className = 'continent-section';
        section.innerHTML = `<div class="continent-title">${translations[currentLang].continents[continent] || continent}</div>`;
        continentGroups[continent].sort().forEach(country => {
            const btn = document.createElement('button');
            btn.className = 'country-btn';
            const countryName = translations[currentLang].countries[country] + " (" + grouped[country].length + ")";
            btn.innerHTML = `<span class="flag">${countryFlags[country] || ''}</span> <span class="country-name">${countryName}</span>`;
            btn.onclick = () => renderGlasses(country);
            section.appendChild(btn);
        });
        collectionDiv.appendChild(section);
    });
}

function renderGlasses(country) {
    updateURL(country);
    document.querySelector('.intro').style.display = 'none';
    collectionDiv.innerHTML = '';
    const backBtn = document.createElement('button');
    backBtn.textContent = translations[currentLang].backToCountries;
    backBtn.className = 'back-btn';
    backBtn.onclick = () => {
        updateURL();
        renderCountries();
    };
    collectionDiv.appendChild(backBtn);

    const section = document.createElement('div');
    section.className = 'country-section';
    section.innerHTML = `<div class="country-title">${countryFlags[country] || ''} ${translations[currentLang].countries[country] || country}</div>`;

    // Group glasses by brewery
    const breweryGroups = {};
    grouped[country].forEach(glass => {
        if (!breweryGroups[glass.brewery]) {
            breweryGroups[glass.brewery] = [];
        }
        breweryGroups[glass.brewery].push(glass);
    });

    const breweryList = document.createElement('div');
    breweryList.className = 'brewery-list';
    Object.keys(breweryGroups).sort().forEach(brewery => {
        const breweryCard = document.createElement('div');
        breweryCard.className = 'brewery-card';
        const breweryImage = getBreweryImage(brewery);
        const breweryName = brewery + " (" + breweryGroups[brewery].length + ")";
        breweryCard.innerHTML = `
            <img class="brewery-photo" src="${breweryImage}" alt="${brewery}" />
            <div class="brewery-name">${breweryName}</div>
        `;
        breweryCard.onclick = () => {
            updateURL(country, brewery);
            renderBreweryGlasses(country, brewery);
        };
        breweryList.appendChild(breweryCard);
    });
    section.appendChild(breweryList);
    collectionDiv.appendChild(section);
}

function renderBreweryGlasses(country, brewery) {
    updateURL(country, brewery);
    document.querySelector('.intro').style.display = 'none';
    collectionDiv.innerHTML = '';
    const backBtn = document.createElement('button');
    backBtn.textContent = translations[currentLang].backToBreweries;
    backBtn.className = 'back-btn';
    backBtn.onclick = () => {
        updateURL(country);
        renderGlasses(country);
    };
    collectionDiv.appendChild(backBtn);

    const section = document.createElement('div');
    section.className = 'country-section';
    section.innerHTML = `<div class="country-title">${countryFlags[country] || ''} ${translations[currentLang].countries[country] || country} - <span class="brewery-name">${brewery}</span></div>`;

    const list = document.createElement('div');
    list.className = 'glass-list';
    grouped[country].filter(glass => glass.brewery === brewery).forEach(glass => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.innerHTML = `
        <img src="${glass.thumbnail}" alt="${glass.name}">
        <div class="glass-name">${glass.name}</div>
        <div class="description">${glass.type}</div>
    `;
        card.onclick = () => showGlassModal(glass);
        list.appendChild(card);
    });
    section.appendChild(list);
    collectionDiv.appendChild(section);
}

function showGlassModal(glass) {
// Modal logic
    const modal = document.getElementById('glass-modal');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalType = document.getElementById('modal-type');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.close-btn');

    modalImage.src = glass.image;
    modalImage.alt = glass.name;
    modalName.textContent = glass.name;
    modalType.textContent = glass.type;
    modalDescription.textContent = glass.description;
    modal.style.display = 'flex';

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}

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
    // Buttons (back, close, etc.)
    document.querySelectorAll('.back-btn').forEach(btn => {
        if (btn.closest('.country-section')) {
            btn.textContent = translations[currentLang].backToBreweries;
        } else {
            btn.textContent = translations[currentLang].backToCountries;
        }
    });
}

document.getElementById('lang-select').value = currentLang;
document.getElementById('lang-select').addEventListener('change', (e) => {
    setLanguage(e.target.value);
    handleURLChange();
});

// --- UPDATE INTRO TEXT FOR TRANSLATIONS ---
function updateIntroText() {
    const introP = document.querySelector('.intro');
    if (!introP) return;
    introP.innerHTML = translations[currentLang].introText
        .replace('{glasses}', beerGlasses.length)
        .replace('{breweries}', Object.keys(breweries).length)
        .replace('{countries}', Object.keys(grouped).length)
        + '<br>' + translations[currentLang].infoLink;
}

// Call updateTranslations on load
window.addEventListener('DOMContentLoaded', updateTranslations);
window.addEventListener('DOMContentLoaded', handleURLChange);

// Add URL routing functions
function updateURL(country, brewery = null) {
    if (brewery) {
        window.location.hash = `#${encodeURIComponent(country)}/${encodeURIComponent(brewery)}`;
    } else if (country) {
        window.location.hash = `#${encodeURIComponent(country)}`;
    } else {
        window.location.hash = '';
    }
}

function handleURLChange() {
    const hash = window.location.hash.slice(1); // Remove #
    if (!hash) {
        renderCountries();
        return;
    }

    const parts = hash.split('/').map(part => decodeURIComponent(part));
    const country = parts[0];
    const brewery = parts[1];

    if (brewery && grouped[country]) {
        renderBreweryGlasses(country, brewery);
    } else if (country && grouped[country]) {
        renderGlasses(country);
    } else {
        renderCountries();
    }
}
