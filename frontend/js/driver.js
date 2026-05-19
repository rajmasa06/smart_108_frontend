const status = document.getElementById('driverStatus');
const assigned = document.getElementById('assignedList');
const faData = document.getElementById('firstAidData');
let simTimer = null;

document.getElementById('logout')?.addEventListener('click',()=>{localStorage.clear(); location.href='login.html';});

document.getElementById('startDutyBtn')?.addEventListener('click', async ()=>{
  try{ const data= await apiRequest('/api/ambulance/duty/start','POST',{},true); status.textContent='AVAILABLE'; status.className='badge bg-success'; assigned.textContent=JSON.stringify(data,null,2);}catch(e){assigned.textContent=e.message;}
});

document.getElementById('loadAssignedBtn')?.addEventListener('click', async ()=>{
  try{ const data= await apiRequest('/api/ambulance/emergencies/assigned','POST',{},true); assigned.textContent=JSON.stringify(data,null,2); }catch(e){ assigned.textContent=e.message; }
});

function emergencyAction(action){
  const id = document.getElementById('emergencyId').value;
  const map={accept:'accept',scene:'at-scene',transport:'start-transport',hospital:'reached-hospital',complete:'complete'};
  return apiRequest(`/api/ambulance/emergency/${id}/${map[action]}`,'POST',{},true);
}

document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',async()=>{ try{ const r = await emergencyAction(btn.dataset.action); assigned.textContent = JSON.stringify(r,null,2);}catch(e){assigned.textContent=e.message;}}));

document.getElementById('loadQuestions')?.addEventListener('click', async ()=>{ try{ faData.textContent=JSON.stringify(await apiRequest('/api/ambulance/first-aid/questions','GET',null,true),null,2);}catch(e){faData.textContent=e.message;} });
document.getElementById('loadOptions')?.addEventListener('click', async ()=>{ const id=firstAidEmergencyId.value; try{ faData.textContent=JSON.stringify(await apiRequest(`/api/ambulance/emergency/${id}/first-aid/options`,'GET',null,true),null,2);}catch(e){faData.textContent=e.message;} });
document.getElementById('submitFirstAid')?.addEventListener('click', async ()=>{ const id=firstAidEmergencyId.value; const payload={answers:[]}; try{ faData.textContent=JSON.stringify(await apiRequest(`/api/ambulance/emergency/${id}/first-aid`,'POST',payload,true),null,2);}catch(e){faData.textContent=e.message;} });

document.getElementById('liveSimBtn')?.addEventListener('click',()=>{
  const ambulanceId = localStorage.getItem('ambulanceId') || prompt('Ambulance ID?');
  connectSocket();
  if(simTimer){clearInterval(simTimer); simTimer=null; return;}
  let lat=17.385, lng=78.4867;
  simTimer=setInterval(async()=>{ lat += (Math.random()-0.5)*0.001; lng += (Math.random()-0.5)*0.001; const payload={ambulanceId,latitude:lat,longitude:lng};
    try{ await apiRequest('/api/ambulance/location/update','POST',payload,true);}catch{}
    sendLocation(payload);
  },2000);
});
