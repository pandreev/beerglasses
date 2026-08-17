// --- COLLECTION DATA ---
const beerGlasses = [
    ...australiaFosters,
    ...austriaGoesser,
    ...glassesBelgium,
    ...belgiumAbbaye_dAulne,
    ...belgiumChouffe,
    ...belgiumDuvel,
    ...belgiumGrimbergen,
    ...belgiumGuldenDraak,
    ...belgiumLeffe,
    ...belgiumOthers,
    ...belgiumStella,
    ...bulgariaAriana,
    ...bulgariaKamenitza,
    ...bulgariaShumensko,
    ...bulgariaZagorka,
    ...bulgariaOthers,
    ...czechiaBudweiserBudvar,
    ...czechiaPilsnerUrquell,
    ...czechiaOthers,
    ...czechiaStarobrno,
    ...czechiaStaropramen,
    ...denmarkCarlsberg,
    ...denmarkTuborg,
    ...glassesDenmark,
    ...greeceMythos,
    ...englandOthers,
    ...glassesFrance,
    ...indiaKingfisher,
    ...italyNastroAzzurro,
    ...italyIchnusa,
    ...franceKronenbourg,
    ...franceOthers,
    ...germanyAyinger,
    ...germanyErdinger,
    ...germanyFranziskaner,
    ...germanyBenediktiner,
    ...germanyLoewenbraeu,
    ...germanyPaulaner,
    ...germanyOthers,
    ...glassesJapan,
    ...glassesGermany,
    ...irelandGuinness,
    ...irelandKilkenny,
    ...irelandMurphys,
    ...irelandSmithwicks,
    ...glassesIreland,
    ...lithuaniaSvyturys,
    ...netherlandsAmstel,
    ...netherlandsBavaria,
    ...netherlandsBuckler,
    ...netherlandsHeineken,
    ...netherlandsLaTrappe,
    ...glassesNetherlands,
    ...portugalSuperBock,
    ...scotlandBrewdog,
    ...scotlandSkol,
    ...scotlandTennents,
    ...glassesSpain,
    ...spainAlhambra,
    ...spainAmbar,
    ...spainAmstelCerveza,
    ...spainArriaca,
    ...spainCruzcampo,
    ...spainDamm,
    ...spainDorada,
    ...spainElAguila,
    ...spainEstrellaGalicia,
    ...spainMahou,
    ...spainSanMiguel,
    ...spainVictoria,
    ...spainOthers,
    ...swedenSpendrup,
    ...glassesScotland,
    ...usaBudweiser,
    ...glassesUsa,
];

// Map country to flag emoji
const countryFlags = {
    'Australia': '🇦🇺',
    'Austria': '🇦🇹',
    'Belgium': '🇧🇪',
    'Bulgaria': '🇧🇬',
    'Czechia': '🇨🇿',
    'Denmark': '🇩🇰',
    'Estonia': '🇪🇪',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'France': '🇫🇷',
    'Germany': '🇩🇪',
    'Greece': '🇬🇷',
    'Hungary': '🇭🇺',
    'India': '🇮🇳',
    'Ireland': '🇮🇪',
    'Italy': '🇮🇹',
    'Lithuania': '🇱🇹',
    'Japan': '🇯🇵',
    'Netherlands': '🇳🇱',
    'Poland': '🇵🇱',
    'Portugal': '🇵🇹',
    'Romania': '🇷🇴',
    'Russia': '🇷🇺',
    'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'Spain': '🇪🇸',
    'Sweden': '🇸🇪',
    'Ukraine': '🇺🇦',
    'United Kingdom': '🇬🇧',
    'United States of America': '🇺🇸',
};

const countryContinents = {
    "Austria": "Europe",
    "Bulgaria": "Europe",
    "Belgium": "Europe",
    "Czechia": "Europe",
    "Denmark": "Europe",
    "England": "Europe",
    "Italy": "Europe",
    "France": "Europe",
    "Germany": "Europe",
    "Greece": "Europe",
    "Ireland": "Europe",
    "Lithuania": "Europe",
    "Portugal": "Europe",
    "Netherlands": "Europe",
    "Scotland": "Europe",
    "Spain": "Europe",
    "Sweden": "Europe",
    "United States of America": "North America",
    "India": "Asia",
    "Japan": "Asia",
    "Australia": "Oceania",
};

const continentOrder = ["Europe", "North America", "Asia", "South America", "Africa", "Oceania"];

// Group glasses by country
const grouped = beerGlasses.reduce((acc, glass) => {
    acc[glass.country] = acc[glass.country] || [];
    acc[glass.country].push(glass);
    return acc;
}, {});

function getBreweryImage(breweryName) {
    return breweries[breweryName] || 'breweries/img/default.png';
}

function getGlassesByBrewery(country, brewery) {
    return grouped[country]
        .filter(glass => glass.brewery === brewery)
        .sort((a, b) => {
            const nameCompare = a.name.localeCompare(b.name);
            if (nameCompare !== 0) return nameCompare;
            return a.type.localeCompare(b.type);
        });
}

// --- SEARCH HELPERS ---
function getSearchableText(glass) {
    return [glass.name, glass.brewery, glass.country, glass.type, glass.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

function searchGlasses(glasses, query) {
    const q = query.trim().toLowerCase();
    if (!q) return glasses;
    return glasses.filter(glass => getSearchableText(glass).includes(q));
}

function getTotalBeerGlassesPrice(glasses) {
    return glasses.reduce((total, glass) => {
        const price = parseFloat(glass.price);
        return total + (isNaN(price) ? 0 : price);
    }, 0);
}
