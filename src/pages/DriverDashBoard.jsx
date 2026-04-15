import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import JsonInput from '../components/JsonInput';
import LiveMap from '../map/LiveMap';
import {
  acceptEmergency,
  completeEmergency,
  getAssignedEmergencies,
  getFirstAidOptions,
  getFirstAidQuestions,
  markAtScene,
  reachedHospital,
  startDuty,
  startTransport,
  submitFirstAid,
  updateLocation
} from '../api/driverApi';
import { connectStomp, disconnectStomp, sendDriverLocation } from '../websocket/stompClient';

const nav = ['Start Duty', 'Assigned Emergencies', 'Emergency Status', 'First Aid', 'Live Tracking'];

export default function DriverDashboard() {
  const [selected, setSelected] = useState(nav[0]);
  const [status, setStatus] = useState('OFFLINE');
  const [out, setOut] = useState('');
  const [ambulanceId, setAmbulanceId] = useState('AMB-108');
  const [emergencyId, setEmergencyId] = useState('');
  const [position, setPosition] = useState([17.385, 78.4867]);
  const intervalRef = useRef(null);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    disconnectStomp();
  }, []);

  const run = async (apiCall) => {
    try {
      const res = await apiCall();
      setOut(JSON.stringify(res.data, null, 2));
    } catch (e) {
      setOut(e.response?.data ? JSON.stringify(e.response.data, null, 2) : e.message);
    }
  };

  const startLiveTracking = () => {
    connectStomp({ onConnect: () => setOut('WebSocket connected') });

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      setPosition((prev) => {
        const jitterLat = (Math.random() - 0.5) * 0.0008;
        const jitterLng = (Math.random() - 0.5) * 0.0008;
        const next = [prev[0] + jitterLat, prev[1] + jitterLng];

        const payload = { ambulanceId, latitude: next[0], longitude: next[1] };

        updateLocation(payload).catch(() => {});
        sendDriverLocation(payload);

        return next;
      });
    }, 2000);

    setStatus('BUSY');
  };

  const stopLiveTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setStatus('AVAILABLE');
  };

  return (
    <div className="dashboard">
      <Sidebar title="Driver Panel" items={nav} selected={selected} onSelect={setSelected} />
      <main className="content">
        <h1>Driver Dashboard <StatusBadge status={status} /></h1>

        {selected === 'Start Duty' && (
          <JsonInput
            label="Start Duty - POST /api/ambulance/duty/start"
            defaultJson={'{\n  "ambulanceId": "AMB-108",\n  "latitude": 17.385,\n  "longitude": 78.4867\n}'}
            onSubmit={(p) => run(() => startDuty(p))}
            buttonText="Start Duty"
          />
        )}

        {selected === 'Assigned Emergencies' && (
          <JsonInput
            label="Assigned Emergencies - POST /api/ambulance/emergencies/assigned"
            defaultJson={'{}'}
            onSubmit={(p) => run(() => getAssignedEmergencies(p))}
            buttonText="Load Assigned Emergencies"
          />
        )}

        {selected === 'Emergency Status' && (
          <div className="card">
            <h3>Update Emergency Status</h3>
            <input placeholder="Emergency ID" value={emergencyId} onChange={(e) => setEmergencyId(e.target.value)} />
            <div className="row wrap">
              <button onClick={() => run(() => acceptEmergency(emergencyId))}>Accept</button>
              <button onClick={() => run(() => markAtScene(emergencyId))}>At Scene</button>
              <button onClick={() => run(() => startTransport(emergencyId))}>Start Transport</button>
              <button onClick={() => run(() => reachedHospital(emergencyId))}>Reached Hospital</button>
              <button onClick={() => run(() => completeEmergency(emergencyId))}>Complete</button>
            </div>
          </div>
        )}

        {selected === 'First Aid' && (
          <div className="grid-2">
            <div className="card">
              <h3>First Aid APIs</h3>
              <input placeholder="Emergency ID" value={emergencyId} onChange={(e) => setEmergencyId(e.target.value)} />
              <div className="row wrap">
                <button onClick={() => run(() => getFirstAidQuestions())}>Get Questions</button>
                <button onClick={() => run(() => getFirstAidOptions(emergencyId))}>Get Options</button>
                <button onClick={() => run(() => submitFirstAid(emergencyId, { answer: 'sample' }))}>Submit First Aid</button>
              </div>
            </div>
            <div className="card">
              <h3>Note</h3>
              <p>Replace sample first-aid payload in code/UI with your exact backend fields if different.</p>
            </div>
          </div>
        )}

        {selected === 'Live Tracking' && (
          <div className="grid-2">
            <div className="card">
              <h3>Driver Live Tracking Simulation</h3>
              <label>Ambulance ID</label>
              <input value={ambulanceId} onChange={(e) => setAmbulanceId(e.target.value)} />
              <p>Sends location every 2 seconds via:</p>
              <ul>
                <li>POST /api/ambulance/location/update</li>
                <li>STOMP send /app/location</li>
              </ul>
              <div className="row">
                <button onClick={startLiveTracking}>Start Live Tracking</button>
                <button onClick={stopLiveTracking}>Stop Live Tracking</button>
              </div>
            </div>
            <LiveMap targetPosition={position} />
          </div>
        )}

        <pre>{out}</pre>
      </main>
    </div>
  );
}
