// --- URL ROUTING ---
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
    globalSearchInput.value = '';

    const hash = window.location.hash.slice(1); // Remove #
    if (hash === 'duplicates') {
        renderDuplicates();
        return;
    }

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

// --- GLOBAL SEARCH WIRING ---
const globalSearchInput = document.getElementById('global-search');
globalSearchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.trim() === '') {
        handleURLChange();
    } else {
        renderSearchResults(query);
    }
});

// --- BOOTSTRAP ---
window.addEventListener('DOMContentLoaded', updateTranslations);
window.addEventListener('DOMContentLoaded', handleURLChange);
window.addEventListener('hashchange', handleURLChange);
