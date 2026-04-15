import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import JsonInput from '../components/JsonInput';
import LiveMap from '../map/LiveMap';
import { createEmergency } from '../api/userApi';
import { connectStomp, disconnectStomp, subscribeAmbulance } from '../websocket/stompClient';

const nav = ['Create Emergency', 'Live Tracking'];

export default function UserDashboard() {
  const [selected, setSelected] = useState(nav[0]);
  const [response, setResponse] = useState('');
  const [ambulanceId, setAmbulanceId] = useState('');
  const [position, setPosition] = useState([17.385, 78.4867]);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => () => disconnectStomp(), []);

  const emergencyDefault = useMemo(
    () => '{\n  "patientName": "",\n  "contact": "",\n  "latitude": 17.385,\n  "longitude": 78.4867,\n  "emergencyType": ""\n}',
    []
  );

  const handleEmergency = async (payload) => {
    try {
      const res = await createEmergency(payload);
      setResponse(JSON.stringify(res.data, null, 2));

      const idFromResponse =
        res.data?.ambulanceId ||
        res.data?.assignedAmbulanceId ||
        res.data?.assignedAmbulance?.id ||
        '';
      if (idFromResponse) setAmbulanceId(String(idFromResponse));
    } catch (e) {
      setResponse(e.response?.data ? JSON.stringify(e.response.data, null, 2) : e.message);
    }
  };

  const startSubscription = () => {
    connectStomp({
      onConnect: () => {
        subscribeAmbulance(ambulanceId, (message) => {
          setPosition([Number(message.latitude), Number(message.longitude)]);
          setSubscribed(true);
        });
      },
      onError: (err) => setResponse(`WebSocket error: ${err?.headers?.message || 'stomp error'}`)
    });
  };

  return (
    <div className="dashboard">
      <Sidebar title="User Panel" items={nav} selected={selected} onSelect={setSelected} />
      <main className="content">
        <h1>User Dashboard</h1>
        {selected === 'Create Emergency' && (
          <>
            <JsonInput label="Create Emergency - POST /api/user/emergency/create" defaultJson={emergencyDefault} onSubmit={handleEmergency} />
            <pre>{response}</pre>
          </>
        )}

        {selected === 'Live Tracking' && (
          <div className="grid-2">
            <div className="card">
              <h3>Track Assigned Ambulance</h3>
              <input
                placeholder="Enter ambulanceId"
                value={ambulanceId}
                onChange={(e) => setAmbulanceId(e.target.value)}
              />
              <button disabled={!ambulanceId} onClick={startSubscription}>Subscribe /topic/ambulance/{'{ambulanceId}'}</button>
              <p>{subscribed ? 'Subscribed ✅ (real-time)' : 'Not subscribed yet'}</p>
            </div>
            <LiveMap targetPosition={position} />
          </div>
        )}
      </main>
    </div>
  );
}
