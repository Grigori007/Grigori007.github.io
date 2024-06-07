const RotterdamCoordinates = {
    Latitude: 51.9177469,
    Longitude: 4.336039
};

const map = L.map('map').setView([RotterdamCoordinates.Latitude, RotterdamCoordinates.Longitude], 11);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }
).addTo(map);

const input = document.getElementById("fileInput");

input.addEventListener("change", (e) => processData(e, map));