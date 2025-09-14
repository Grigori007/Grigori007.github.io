const versions = [
  "001","002","003","004","005","006","007","008","009","010",
  "011","012","013","014","015","016","017","018","019","020",
  "021","022","023","024","025","026","027","028","029","030",
  "031","032","033","034","035","036","037","038","039","040", "040_damian",
  "041","042","043","044","045"
];
const exrFileTemplate = "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip3/src/assets/textures/exr/GSG_PRO_STUDIOS_METAL_{0}_sm.exr";

export function initExrGallery() {
    const fileNameDiv = document.createElement("div");
    fileNameDiv.id = "fileNameDiv";
    fileNameDiv.style.color = "white";

    document.appendChild(fileNameDiv);

    const changeLeftButton = document.createElement("input");
    changeLeftButton.type = "button";
    changeLeftButton.innerText = "<-";

    changeLeftButton.onclick = () => {
        const exrGalleryIndex = localStorage.getItem("exrGalleryIndex");

        if (!isNumeric(exrGalleryIndex)) {
            localStorage.setItem("exrGalleryIndex", "0");
            location.reload();
        }

        let intIndex = parseInt(exrGalleryIndex);
        if (intIndex === 0) {
            localStorage.setItem("exrGalleryIndex", "0");
        }
        else {
            intIndex--;
            localStorage.setItem("exrGalleryIndex", intIndex.toString());
        }

        location.reload();
    }

    document.appendChild(changeLeftButton);

    const changeRightButton = document.createElement("input");
    changeRightButton.type = "button";
    changeRightButton.innerText = "->";

    changeRightButton.onclick = () => {
        const exrGalleryIndex = localStorage.getItem("exrGalleryIndex");

        if (!isNumeric(exrGalleryIndex)) {
            localStorage.setItem("exrGalleryIndex", "0");
            location.reload();
        }

        let intIndex = parseInt(exrGalleryIndex);
        if (intIndex === versions.length - 1) {
            localStorage.setItem("exrGalleryIndex", intIndex.toString());
        }
        else {
            intIndex++;
            localStorage.setItem("exrGalleryIndex", intIndex.toString());
        }

        location.reload();
    }

    document.appendChild(changeRightButton);
}

export function getExrFileName() {
    let exrGalleryIndex = localStorage.getItem("exrGalleryIndex");
    const fileNameDiv = document.getElementById("fileNameDiv");

    if (!isNumeric(exrGalleryIndex)) {
        exrGalleryIndex = "0";
        localStorage.setItem("exrGalleryIndex", "0");
    }

    const index = parseInt(exrGalleryIndex);
    const version = versions[index];
    const fileName = exrFileTemplate.replace("{0}", version);

    fileNameDiv.innerText = fileName;
    
    return fileName;
}

function isNumeric(str) {
  if (typeof str != "string"){
    return false;
  }
    
  return !isNaN(str) && !isNaN(parseFloat(str));
}