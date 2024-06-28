function getMarkerColor(emissionType) {
    switch(emissionType) {
        case "Methane":
            return "#45f542";
        case "Ammonia":
            return "#424bf5";
        case "SO2":
            return "#ecf542";
        case "NO2":
            return "#42e9f5";
        case "CO2":
            return "#f54242";
        default:
            throw new Error("Unsupported emission type");
    }
}

function getIconAnchorOffset(emissionType) {
    switch(emissionType) {
        case "Methane":
            return [0, 0];
        case "Ammonia":
            return [0, 35];
        case "SO2":
            return [30, 0];
        case "NO2":
            return [30, 35];
        case "CO2":
            return [-30, 0];
        default:
            throw new Error("Unsupported emission type");
    }
}

function markCompaniesOnMap(companies, markersLayerGroup) {
    companies.forEach(company => {
        const markerColor = getMarkerColor(company.emissionType);

        const markerHtmlStyles = `
        background-color: ${markerColor};
        width: 1.5rem;
        height: 1.5rem;
        display: block;

        position: relative;
        border-radius: 1rem 1rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`;

        const iconAnchorOffset = getIconAnchorOffset(company.emissionType);

        const icon = L.divIcon({
            className: "customIcon",
            iconAnchor: iconAnchorOffset,
            labelAnchor: [-6, 0],
            popupAnchor: [0, -36],
            html: `<span style="${markerHtmlStyles}" />`
        });

        L.marker([company.xCoordinate, company.yCoordinate], { title: `${company.companyName} - ${company.emissionType}`, icon: icon }).addTo(markersLayerGroup);
    });
}

function filterCompaniesByEmissionSectorAndYear(allCompanies) {
    const { emissionTypesToDisplay, sectorsToDisplay, yearsToDisplay } = getEmissionsSectorsYearsToDisplayFromStorage();
    const companiesFilteredByEmissionAndSector = allCompanies.filter(company => emissionTypesToDisplay.includes(company.emissionType) && sectorsToDisplay.includes(company.sector))
    const companiesFilteredByYear = companiesFilteredByEmissionAndSector.filter(company => yearsToDisplay.some(year => !!company[`emission${year}`]));

    return companiesFilteredByYear;
}

async function processData(file, markersLayerGroup) {
    const companiesObjectsFromExcelFile = await convertExcelToJson(file);
    const uniqueCompaniesObjects = filterCompanies(companiesObjectsFromExcelFile);
    const domainCompanyObjects = mapToDomainObject(uniqueCompaniesObjects);

    projectCompanyObjectsCoordiantesToEpsg4326(domainCompanyObjects);

    const companiesObject = [];
    for (const emissionType in domainCompanyObjects) {
        companiesObject.push(domainCompanyObjects[emissionType]);
    }
    
    const allCompanies = companiesObject.flat();
    
    const companiesToDisplay = filterCompaniesByEmissionSectorAndYear(allCompanies);

    markCompaniesOnMap(companiesToDisplay, markersLayerGroup);
};

function processDataFromFile(markersLayerGroup) {
    const allCompanies = loadDataFromFile();
    const companiesToDisplay = filterCompaniesByEmissionSectorAndYear(allCompanies);

    markCompaniesOnMap(companiesToDisplay, markersLayerGroup);
}

function rerenderMarkers(map, markersLayerGroup) {
    map.eachLayer((layer) => {
        if (layer['_latlng'] != undefined) {
            layer.remove();
        }
    });

    processDataFromFile(map, markersLayerGroup);
}

function resetMap(map, markersLayerGroup) {
    resetLocalStorage();
    loadControlPanelSettingsFromStorage();
    rerenderMarkers(map, markersLayerGroup);
}

function renderCheckbox(name, shouldAddColor = false) {
    const checkboxContainer = L.DomUtil.create("div");
    checkboxContainer.className = "checkbox-container";

    const input = L.DomUtil.create("input");
    const label = L.DomUtil.create("label");

    input.type = "checkbox";
    input.name = name;
    input.value = name;
    input.className = "controlPanelCheckbox";
    input.onchange = onCheckboxClick;

    label.htmlFor = name;
    label.innerHTML = name;
    label.className = "controlPanelCheckboxLabel";

    checkboxContainer.appendChild(input);
    checkboxContainer.appendChild(label);

    if (shouldAddColor) {
        const colorMarker = L.DomUtil.create("div");
        colorMarker.className = "emission-type-color-marker";
        colorMarker.style.backgroundColor = getMarkerColor(name);
        checkboxContainer.appendChild(colorMarker);
    }

    return checkboxContainer;
}

function addUI(map, markersLayerGroup) {
    L.Control.CustomMapControlPanel = L.Control.extend({
        onAdd: function(_) {
            const div = L.DomUtil.create("div");
            div.id = "controller";

            const emissionTypesTitle = L.DomUtil.create("h3");
            emissionTypesTitle.innerHTML = "Emission types";
            emissionTypesTitle.className = "top-title";
            div.appendChild(emissionTypesTitle);

            emissionTypes.forEach(emissionType => {
                const checkbox = renderCheckbox(emissionType, true);
                div.appendChild(checkbox);
            });

            const sectorsTitle = L.DomUtil.create("h3");
            sectorsTitle.innerHTML = "Sectors";
            div.appendChild(sectorsTitle);

            sectors.forEach(sector => {
                const checkbox = renderCheckbox(sector);
                div.appendChild(checkbox);
            });

            const yearsTitle = L.DomUtil.create("h3");
            yearsTitle.innerHTML = "Emissions from years";
            div.appendChild(yearsTitle);

            years.forEach(year => {
                const checkbox = renderCheckbox(year);
                div.appendChild(checkbox);
            });

            const buttonPanel = L.DomUtil.create("div");
            buttonPanel.className = "button-panel";

            const applyFilterButton = L.DomUtil.create("button");
            applyFilterButton.className = "filter-button";
            applyFilterButton.innerText = "Apply";
            applyFilterButton.onclick = (e) => rerenderMarkers(map, markersLayerGroup);

            const resetFilterButton = L.DomUtil.create("button");
            resetFilterButton.className = "filter-button";
            resetFilterButton.innerText = "Reset";
            resetFilterButton.onclick = (e) => resetMap(map, markersLayerGroup);

            buttonPanel.appendChild(applyFilterButton);
            buttonPanel.appendChild(resetFilterButton);

            div.appendChild(buttonPanel);

            return div;
        },
        onRemove: function(_) {}
    });

    L.control.customMapControlPanel = function(opts) {
        return new L.Control.CustomMapControlPanel(opts);
    }

    L.control.customMapControlPanel({ position: "topright" }).addTo(map);
}