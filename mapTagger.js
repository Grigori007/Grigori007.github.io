const markerHtmlStyles = `
  background-color: ${myCustomColour};
  width: 3rem;
  height: 3rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;



function getMarkerColor(emissionType) {
    // switch(emissionType) {
    //     case "Methaan":
    //         return "methaan";
    //     case "Ammoniak":
    //         return "ammoniak";
    //     case "Zwaveloxiden (als SO2)":
    //         return "so2";
    //     case "Stikstofoxiden (als NO2)":
    //         return "no2";
    //     case "Koolstofdioxide":
    //         return "co2";
    //     default:
    //         throw new Error("Unsupported emission type");
    // }
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

        const icon = L.divIcon({
            //class
            iconAnchor: [0, 24],
            labelAnchor: [-6, 0],
            popupAnchor: [0, -36],
            //html: `<span style="${markerHtmlStyles}" />`
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
    console.log(allCompanies);
    markCompaniesOnMap(allCompanies, map);
};