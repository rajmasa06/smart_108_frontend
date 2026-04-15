import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client;

export function connectStomp({ onConnect, onError }) {
  if (client?.active) return client;

  client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 3000,
    onConnect,
    onStompError: onError
  });

  client.activate();
  return client;
}

export function subscribeAmbulance(ambulanceId, onMessage) {
  if (!client?.connected) return null;
  return client.subscribe(`/topic/ambulance/${ambulanceId}`, (frame) => {
    const payload = JSON.parse(frame.body);
    onMessage(payload);
  });
}

export function sendDriverLocation(location) {
  if (!client?.connected) return;
  client.publish({
    destination: '/app/location',
    body: JSON.stringify(location)
  });
}

export function disconnectStomp() {
  if (client) {
    client.deactivate();
    client = null;
  }
}
