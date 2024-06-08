// Projection of Netherlands local coordinate system to EPSG:4326

// Define the RD New projection (EPSG:28992)
proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.2369,50.0087,465.658,0.406857330322398,-0.350732676542563,1.8703473836068,4.0812 +units=m +no_defs");

// Define WGS84 projection (EPSG:4326)
proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");

const targetSheets = [ "Mathane", "Amonnia", "SO2", "NO2", "CO2" ];

const NativeNames = {
  CompanyName: "Bedrijf",
  XCoordinate: "Xcoord",
  YCoordinate: "Ycoord",
  EmissionType: "Stof",
  IsInPort: "IsInPort",
  Sector: "Sector"
};

function convertExcelToJson(e) {
  const file = e.target.files[0];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });

    const companiesData = workbook.SheetNames
      .filter(sheetName => targetSheets.includes(sheetName))
      .reduce((accumulator, currentSheetName) => {
        const xlRowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[currentSheetName]);

        return {
          ...accumulator,
          [currentSheetName]: xlRowObject
        };
      }, {});

      resolve(companiesData);
    };

    reader.onerror = (event) => {
      console.log("Excel read operation error.");
      reject("Error");
    }

    reader.readAsBinaryString(file);
  });
}

function loadDataFromFile() {
  const companiesData = data;
  return companiesData;
}

function filterCompanies(companies) {
  const uniqueCompaniesEntries = {};

  for (const key in companies) {
    const uniqueCompaniesNames = [];
    const uniqueCompanies = [];

    companies[key].forEach(companyObject => {
      if (companyObject[NativeNames.IsInPort] && companyObject[NativeNames.IsInPort] === "1" && !uniqueCompaniesNames.includes(companyObject[NativeNames.CompanyName])) {
        uniqueCompaniesNames.push(companyObject[NativeNames.CompanyName]);
        uniqueCompanies.push(companyObject);
      }
    });

    uniqueCompaniesEntries[key] = uniqueCompanies;
  }
  
  return uniqueCompaniesEntries;
}

function translateSector(nativeSectorName) {
  const nameToTranslate = (nativeSectorName || "").toLocaleLowerCase();

  switch (nameToTranslate) {
    case "afvalverwijdering":
      return "Waste disposal";
    case "bouw":
      return "Construction";
    case "chemische industrie":
      return "Chemical industry";
    case "energiesector":
      return "Energy sector";
    case "handel, diensten en overheid (hdo)":
      return "Trade, services and government";
    case "overige industrie":
      return "Other industry";
    case "raffinaderijen":
      return "Refineries";
    case "riolering en waterzuiveringsinstallaties":
      return "Sewerage and water treatment plants";
    case "":
      return "Sector not specified";
    default:
      throw new Error("Unsupported sector name");
  }
}

function translateEmissionType(nativeEmissionType) {
  const nameToTranslate = (nativeEmissionType || "").toLocaleLowerCase();

  switch (nameToTranslate) {
    case "methaan":
      return "Methane";
    case "ammoniak":
      return "Ammonia";
    case "zwaveloxiden (als so2)":
      return "SO2";
    case "stikstofoxiden (als no2)":
      return "NO2";
    case "koolstofdioxide":
      return "CO2";
    default:
      throw new Error("Unsupported emission type");
  }
}

function mapToDomainObject(companies) {
  for (const key in companies) {
    companies[key] = companies[key].map(companyObject => ({
      companyName: companyObject[NativeNames.CompanyName],
      xCoordinate: companyObject[NativeNames.XCoordinate],
      yCoordinate: companyObject[NativeNames.YCoordinate],
      sector: translateSector(companyObject[NativeNames.Sector]),
      emissionType: translateEmissionType(companyObject[NativeNames.EmissionType]),
    }));
  }

  return companies;
}

function projectCompanyObjectsCoordiantesToEpsg4326(companies) {
  for (const key in companies) {
    companies[key].forEach(companyObject => {
      const xNativeCoordiante = Number(companyObject.xCoordinate);
      const yNativeCoordiante = Number(companyObject.yCoordinate);
  
      const [ projectedYCoordinate, projectedXCoordinate ] = proj4("EPSG:28992", "EPSG:4326", [ xNativeCoordiante, yNativeCoordiante ]);
  
      companyObject.xCoordinate = projectedXCoordinate;
      companyObject.yCoordinate = projectedYCoordinate;
    });
  }
}