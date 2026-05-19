let stompClient = null;
function connectSocket(onMessage){
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, ()=>{ if(onMessage) onMessage({connected:true}); });
}
function subscribeAmbulance(ambulanceId, onLocation){
  if(!stompClient) return;
  stompClient.subscribe(`/topic/ambulance/${ambulanceId}`, m => onLocation(JSON.parse(m.body)));
}
function sendLocation(location){ if(stompClient) stompClient.send('/app/location', {}, JSON.stringify(location)); }
