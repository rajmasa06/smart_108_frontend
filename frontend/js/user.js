const out = document.getElementById('assignedData');
const createBtn = document.getElementById('createEmergencyBtn');
const logout = document.getElementById('logout');
if(logout) logout.onclick = ()=>{localStorage.clear(); location.href='login.html';};
if(createBtn){
  createBtn.onclick = async ()=>{
    try{
      const payload = { latitude: Number(lat.value), longitude: Number(lng.value), address: address.value, patientName: patientName.value, condition: condition.value };
      const created = await apiRequest('/api/user/emergency/create','POST',payload,true);
      out.textContent = JSON.stringify(created,null,2);
    }catch(e){ out.textContent = e.message; }
  }
}
