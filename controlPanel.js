function initLocalStorage() {
    [...emissionTypes, ...sectors, ...years].forEach(key => {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, true);
        }
    });
}

function resetLocalStorage() {
    [...emissionTypes, ...sectors, ...years].forEach(key => localStorage.setItem(key, true));
}

function loadControlPanelSettingsFromStorage() {
    [...emissionTypes, ...sectors, ...years].forEach(key => {
        const value = localStorage.getItem(key);

        if (value !== null) {
            const checkbox = document.getElementsByName(key)[0];

            checkbox.checked = value === "true";
        }
    });
}

function getEmissionsSectorsYearsToDisplayFromStorage() {
    const emissionTypesToDisplay = emissionTypes
        .map(emissionType => localStorage.getItem(emissionType) === "true" ? emissionType : null)
        .filter(emissionType => !!emissionType);

    const sectorsToDisplay = sectors
        .map(sector => localStorage.getItem(sector) === "true" ? sector : null)
        .filter(sector => !!sector);

    const yearsToDisplay = years
        .map(year => localStorage.getItem(year) === "true" ? year : null)
        .filter(year => !!year);

    return { emissionTypesToDisplay, sectorsToDisplay, yearsToDisplay };
}

function onCheckboxClick(e) {
    const key = e.target.name;
    const displayValue = e.target.checked;

    localStorage.setItem(key, displayValue);
}