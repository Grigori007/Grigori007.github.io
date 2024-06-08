function initLocalStorage() {
    [...emissionTypes, ...sectors].forEach(key => {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, true);
        }
    });
}

function resetLocalStorage() {
    [...emissionTypes, ...sectors].forEach(key => localStorage.setItem(key, true));
}

function loadControlPanelSettingsFromStorage() {
    [...emissionTypes, ...sectors].forEach(key => {
        const value = localStorage.getItem(key);

        if (value !== null) {
            const checkbox = document.getElementsByName(key)[0];

            checkbox.checked = value === "true";
        }
    });
}

function getEmissionsAndSectorsToDisplayFromStorage() {
    const emissionTypesToDisplay = emissionTypes
        .map(emissionType => localStorage.getItem(emissionType) === "true" ? emissionType : null)
        .filter(emissionType => !!emissionType);

    const sectorsToDisplay = sectors
        .map(sector => localStorage.getItem(sector) === "true" ? sector : null)
        .filter(sector => !!sector);

    return { emissionTypesToDisplay, sectorsToDisplay };
}

function onCheckboxClick(e) {
    const key = e.target.name;
    const displayValue = e.target.checked;

    localStorage.setItem(key, displayValue);
}