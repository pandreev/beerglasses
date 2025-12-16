const beerGlasses = [
    {
        country: "Germany",
        name: "Weizen Glass",
        brewery: "Paulaner",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Classic tall wheat beer glass from Paulaner."
    },
    {
        country: "Belgium",
        name: "Goblet",
        brewery: "Chimay",
        image: "https://images.unsplash.com/photo-1514361892635-cebbf7d4b6b3?auto=format&fit=crop&w=400&q=80",
        description: "Wide-mouthed goblet for Belgian ales."
    },
    {
        country: "USA",
        name: "Pint Glass",
        brewery: "Sierra Nevada",
        image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        description: "Standard American pint glass."
    },
    {
        country: "Germany",
        name: "Stein",
        brewery: "Hofbräuhaus",
        image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description: "Traditional German beer stein."
    }
];

// Map country to flag emoji
const countryFlags = {
    Germany: "🇩🇪",
    Belgium: "🇧🇪",
    USA: "🇺🇸"
};

// Group by country
const grouped = beerGlasses.reduce((acc, glass) => {
    acc[glass.country] = acc[glass.country] || [];
    acc[glass.country].push(glass);
    return acc;
}, {});

const collectionDiv = document.getElementById('collection');

const countryContinents = {
    Germany: "Europe",
    Belgium: "Europe",
    USA: "North America"
    // Add more as needed
};

const continentOrder = ["Europe", "North America", "Asia", "South America", "Africa", "Oceania"];

function renderCountries() {
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
        section.innerHTML = `<div class="continent-title">${continent}</div>`;
        continentGroups[continent].forEach(country => {
            const btn = document.createElement('button');
            btn.className = 'country-btn';
            btn.innerHTML = `<span class="flag">${countryFlags[country] || ''}</span> <span class="country-name">${country}</span>`;
            btn.onclick = () => renderGlasses(country);
            section.appendChild(btn);
        });
        collectionDiv.appendChild(section);
    });
}

function renderGlasses(country) {
    document.querySelector('.intro').style.display = 'none';
    collectionDiv.innerHTML = '';
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back to countries';
    backBtn.className = 'back-btn';
    backBtn.onclick = renderCountries;
    collectionDiv.appendChild(backBtn);

    const section = document.createElement('div');
    section.className = 'country-section';
    section.innerHTML = `<div class="country-title">${countryFlags[country] || ''} ${country}</div>`;

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
    Object.keys(breweryGroups).forEach(brewery => {
        const breweryCard = document.createElement('div');
        breweryCard.className = 'brewery-card';
        const breweryImage = breweryGroups[brewery][0].image;
        breweryCard.innerHTML = `
            <img class="brewery-photo" src="${breweryImage}" alt="${brewery}" />
            <div class="brewery-name">${brewery}</div>
        `;
        breweryCard.onclick = () => renderBreweryGlasses(country, brewery);
        breweryList.appendChild(breweryCard);
    });
    section.appendChild(breweryList);
    collectionDiv.appendChild(section);
}

function renderBreweryGlasses(country, brewery) {
    document.querySelector('.intro').style.display = 'none';
    collectionDiv.innerHTML = '';
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back to breweries';
    backBtn.className = 'back-btn';
    backBtn.onclick = () => renderGlasses(country);
    collectionDiv.appendChild(backBtn);

    const section = document.createElement('div');
    section.className = 'country-section';
    section.innerHTML = `<div class="country-title">${countryFlags[country] || ''} ${country} - <span class="brewery-name">${brewery}</span></div>`;

    const list = document.createElement('div');
    list.className = 'glass-list';
    grouped[country].filter(glass => glass.brewery === brewery).forEach(glass => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.innerHTML = `
        <img src="${glass.image}" alt="${glass.name}">
        <div class="glass-name">${glass.name}</div>
        <div class="description">${glass.description}</div>
    `;
        card.onclick = () => showGlassModal(glass);
        list.appendChild(card);
    });
    section.appendChild(list);
    collectionDiv.appendChild(section);
}

// Modal logic
const modal = document.getElementById('glass-modal');
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalBrewery = document.getElementById('modal-brewery');
const modalDescription = document.getElementById('modal-description');
const closeBtn = document.querySelector('.close-btn');

function showGlassModal(glass) {
    modalImage.src = glass.image;
    modalImage.alt = glass.name;
    modalName.textContent = glass.name;
    modalBrewery.textContent = glass.brewery;
    modalDescription.textContent = glass.description;
    modal.style.display = 'flex';
}

closeBtn.onclick = () => { modal.style.display = 'none'; };
modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };


renderCountries();