let map = L.map('map').setView([17.385,78.4867], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
let marker = L.marker([17.385,78.4867]).addTo(map).bindPopup('Ambulance');
let anim = null;
function smoothMove(toLat,toLng){
  const from = marker.getLatLng(); let step=0; if(anim) clearInterval(anim);
  anim = setInterval(()=>{step++; const p=step/20; const lat=from.lat+(toLat-from.lat)*p; const lng=from.lng+(toLng-from.lng)*p; marker.setLatLng([lat,lng]); if(step>=20) clearInterval(anim);},100);
}
document.getElementById('connectTracking').addEventListener('click',()=>{
  const id = document.getElementById('ambulanceId').value;
  connectSocket(()=>{subscribeAmbulance(id,loc=>{ smoothMove(loc.latitude,loc.longitude); map.panTo([loc.latitude,loc.longitude]); document.getElementById('trackInfo').textContent = `Last update: ${new Date().toLocaleTimeString()} (${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)})`;});});
});
