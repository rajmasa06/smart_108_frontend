const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const msg = document.getElementById('msg');

if(loginBtn){
  loginBtn.onclick = async ()=>{
    try{
      const payload = { email: email.value, password: password.value, role: role.value };
      const data = await apiRequest('/api/auth/login', 'POST', payload, false);
      setAuth(data);
      location.href = role.value === 'DRIVER' ? 'driver-dashboard.html' : 'user-dashboard.html';
    }catch(e){ msg.textContent = e.message; msg.className='text-danger'; }
  };
}

if(registerBtn){
  registerBtn.onclick = async ()=>{
    try{
      const payload = { name:name.value, phone:phone.value, email:email.value, password:password.value };
      const endpoint = role.value === 'DRIVER' ? '/api/auth/ambulance/register' : '/api/auth/user/register';
      const data = await apiRequest(endpoint, 'POST', payload, false);
      msg.textContent = 'Registered successfully. Go to login.';
      msg.className='text-success';
      console.log(data);
    }catch(e){ msg.textContent = e.message; msg.className='text-danger'; }
  }
}
