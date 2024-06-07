function getMarkerColor(emissionType) {
    switch(emissionType) {
        case "Methaan":
            return "#45f542";
        case "Ammoniak":
            return "#424bf5";
        case "Zwaveloxiden (als SO2)":
            return "#ecf542";
        case "Stikstofoxiden (als NO2)":
            return "#42e9f5";
        case "Koolstofdioxide":
            return "#f54242";
        default:
            throw new Error("Unsupported emission type");
    }
}

function getIconAnchorOffset(emissionType) {
    switch(emissionType) {
        case "Methaan":
            return [0, 0];
        case "Ammoniak":
            return [0, 35];
        case "Zwaveloxiden (als SO2)":
            return [30, 0];
        case "Stikstofoxiden (als NO2)":
            return [30, 35];
        case "Koolstofdioxide":
            return [-30, 0];
        default:
            throw new Error("Unsupported emission type");
    }
}

function markCompaniesOnMap(companies, map) {
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

        L.marker([company.xCoordinate, company.yCoordinate], { title: company.companyName, icon: icon }).addTo(map);
    });
}

async function processData(file, map) {
    const companiesObjectsFromExcelFile = await convertExcelToJson(file);
    const uniqueCompaniesObjects = filterCompanies(companiesObjectsFromExcelFile);
    const domainCompanyObjects = mapToDomainObject(uniqueCompaniesObjects);

    projectCompanyObjectsCoordiantesToEpsg4326(domainCompanyObjects);

    const companiesObject = [];
    for (const emissionType in domainCompanyObjects) {
        companiesObject.push(domainCompanyObjects[emissionType]);
    }

    const allCompanies = companiesObject.flat();

    markCompaniesOnMap(allCompanies, map);
};

function processDataFromFile(map) {
    const domainCompanyObjects = loadDataFromFile();
    const companiesObject = [];

    for (const emissionType in domainCompanyObjects) {
        companiesObject.push(domainCompanyObjects[emissionType]);
    }

    const allCompanies = companiesObject.flat();

    markCompaniesOnMap(allCompanies, map);
}