# Smart 108 Frontend (Vanilla JS)

## Setup
1. Keep backend running at `http://localhost:8080`.
2. Open `frontend/index.html` in browser (or serve with VSCode Live Server).
3. Register user/driver, login, and use dashboards.

## API Integration Map
- `POST /api/auth/ambulance/register` -> `register.html` via `js/auth.js` (Driver role)
- `POST /api/auth/user/register` -> `register.html` via `js/auth.js` (User role)
- `POST /api/auth/login` -> `login.html` via `js/auth.js`
- `POST /api/ambulance/duty/start` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/user/emergency/create` -> `user-dashboard.html` via `js/user.js`
- `GET /api/ambulance/first-aid/questions` -> `driver-dashboard.html` via `js/driver.js`
- `GET /api/ambulance/emergency/{id}/first-aid/options` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/ambulance/emergency/{id}/first-aid` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/ambulance/emergencies/assigned` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/ambulance/emergency/{id}/accept` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/ambulance/emergency/{id}/at-scene` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/ambulance/emergency/{id}/start-transport` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/ambulance/emergency/{id}/reached-hospital` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/ambulance/emergency/{id}/complete` -> `driver-dashboard.html` via `js/driver.js`
- `POST /api/ambulance/location/update` -> `driver-dashboard.html` live simulation in `js/driver.js`

## Real-time workflow
1. Tracking page creates SockJS connection to `/ws`.
2. STOMP subscribe to `/topic/ambulance/{ambulanceId}`.
3. Driver simulation sends location to `/app/location` through STOMP and also to `POST /api/ambulance/location/update` every 2 seconds.
4. Tracking page receives coordinates and animates marker smoothly.

## Files
- HTML: `index.html`, `login.html`, `register.html`, `user-dashboard.html`, `driver-dashboard.html`, `tracking.html`
- CSS: `css/style.css`
- JS: `js/api.js`, `js/auth.js`, `js/user.js`, `js/driver.js`, `js/websocket.js`, `js/tracking.js`
