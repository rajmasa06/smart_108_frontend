const BASE_URL = 'http://localhost:8080';

function getToken(){ return localStorage.getItem('token') || ''; }
function setAuth(data){ localStorage.setItem('token', data.token || data.accessToken || ''); localStorage.setItem('role', data.role || ''); localStorage.setItem('ambulanceId', data.ambulanceId || ''); }

async function apiRequest(path, method='GET', body=null, auth=true){
  const headers = {'Content-Type':'application/json'};
  if(auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE_URL}${path}`, {method, headers, body: body ? JSON.stringify(body) : null});
  const text = await res.text();
  let data = {};
  try{ data = text ? JSON.parse(text) : {}; }catch{ data = {raw:text}; }
  if(!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}
