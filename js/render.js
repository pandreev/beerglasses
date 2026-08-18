// --- RENDERING ---
const collectionDiv = document.getElementById('collection');

function setIntroVisible(visible) {
    document.querySelector('.intro').style.display = visible ? 'block' : 'none';
}

function createBackButton(labelKey, onClick) {
    const backBtn = document.createElement('button');
    backBtn.textContent = translations[currentLang][labelKey];
    backBtn.className = 'back-btn';
    backBtn.onclick = onClick;
    return backBtn;
}

function createGlassCard(glass, { showBreweryCountry = false, showDescription = false, clickable = true } = {}) {
    const card = document.createElement('div');
    card.className = 'glass-card';
    const breweryCountryLine = showBreweryCountry
        ? `<div class="brewery">${countryFlags[glass.country] || ''} ${glass.brewery} — ${translations[currentLang].countries[glass.country] || glass.country}</div>`
        : '';
    const descriptionLine = showDescription && glass.description
        ? `<div class="glass-description">${glass.description}</div>`
        : '';
    card.innerHTML = `
        <img src="${glass.thumbnail}" alt="${glass.name}">
        <div class="glass-name">${glass.name}</div>
        <div class="description">${glass.type}</div>
        ${descriptionLine}
        ${breweryCountryLine}
    `;
    if (clickable) {
        card.onclick = () => showGlassModal(glass);
    }
    return card;
}

// Renders a glass grid into `container`, showing a "no results" message when empty.
function renderGlassList(container, glasses, options = {}) {
    container.innerHTML = '';
    if (glasses.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'no-results';
        empty.textContent = translations[currentLang].noResults;
        container.appendChild(empty);
        return;
    }
    glasses.forEach(glass => container.appendChild(createGlassCard(glass, options)));
}

function renderCountries() {
    setIntroVisible(true);
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
            btn.onclick = () => updateURL(country);
            section.appendChild(btn);
        });
        collectionDiv.appendChild(section);
    });
}

function renderGlasses(country) {
    setIntroVisible(false);
    collectionDiv.innerHTML = '';
    collectionDiv.appendChild(createBackButton('backToCountries', () => updateURL()));

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
        breweryCard.onclick = () => updateURL(country, brewery);
        breweryList.appendChild(breweryCard);
    });
    section.appendChild(breweryList);
    collectionDiv.appendChild(section);
}

function renderBreweryGlasses(country, brewery) {
    setIntroVisible(false);
    collectionDiv.innerHTML = '';
    collectionDiv.appendChild(createBackButton('backToBreweries', () => updateURL(country)));

    const section = document.createElement('div');
    section.className = 'country-section';
    section.innerHTML = `<div class="country-title">${countryFlags[country] || ''} ${translations[currentLang].countries[country] || country} - <span class="brewery-name">${brewery}</span></div>`;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'brewery-search-container';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'brewery-search';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = translations[currentLang].brewerySearchPlaceholder;
    searchContainer.appendChild(searchInput);
    section.appendChild(searchContainer);

    const list = document.createElement('div');
    list.className = 'glass-list';
    section.appendChild(list);
    collectionDiv.appendChild(section);

    const breweryGlasses = getGlassesByBrewery(country, brewery);
    searchInput.addEventListener('input', (e) => {
        renderGlassList(list, searchGlasses(breweryGlasses, e.target.value), { showDescription: true });
    });
    renderGlassList(list, breweryGlasses, { showDescription: true });
}

// --- GLOBAL SEARCH ---
function renderSearchResults(query) {
    setIntroVisible(false);
    collectionDiv.innerHTML = '';
    collectionDiv.appendChild(createBackButton('backToCountries', () => handleURLChange()));

    const results = searchGlasses(beerGlasses, query).sort((a, b) => a.name.localeCompare(b.name));

    const section = document.createElement('div');
    section.className = 'country-section';
    section.innerHTML = `<div class="country-title">${translations[currentLang].searchResultsTitle} "${query}" (${results.length})</div>`;

    const list = document.createElement('div');
    list.className = 'glass-list';
    section.appendChild(list);
    collectionDiv.appendChild(section);

    renderGlassList(list, results, { showBreweryCountry: true });
}

// --- RENDER DUPLICATES ---
function renderDuplicates() {
    setIntroVisible(false);
    collectionDiv.innerHTML = '';
    collectionDiv.appendChild(createBackButton('backToCountries', () => updateURL()));

    const section = document.createElement('div');
    section.className = 'country-section';
    section.innerHTML = `<div class="country-title">Duplicates</div>`;
    const list = document.createElement('div');
    list.className = 'glass-list';
    glassesDuplicates.forEach(glass => {
        list.appendChild(createGlassCard(glass, { clickable: false }));
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
    const modalImages = document.getElementById('modal-images');

    // Set main image
    modalImage.src = glass.image;
    modalImage.alt = glass.name;
    modalImage.className = 'modal-main-image';

    // Remove any previous extra image
    const oldExtra = document.getElementById('modal-extra-image');
    if (oldExtra) oldExtra.remove();

    // Add extra image if present
    if (glass.extraImage) {
        const extraImg = document.createElement('img');
        extraImg.id = 'modal-extra-image';
        extraImg.className = 'modal-extra-image';
        extraImg.src = glass.extraImage;
        extraImg.alt = glass.name + ' extra';
        modalImages.appendChild(extraImg);
    }

    // Log the box property if present
    if (glass.box) {
        console.log('Box:', glass.box);
    }

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
