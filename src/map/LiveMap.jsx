import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const ambulanceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2967/2967350.png',
  iconSize: [38, 38],
  iconAnchor: [19, 19]
});

function AutoCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(position, { animate: true, duration: 0.8 });
  }, [map, position]);
  return null;
}

export default function LiveMap({ targetPosition }) {
  const markerRef = useRef(null);
  const currentRef = useRef(targetPosition);
  const frameRef = useRef(null);

  const center = useMemo(() => targetPosition || [17.385, 78.4867], [targetPosition]);

  useEffect(() => {
    if (!targetPosition) return;

    const [targetLat, targetLng] = targetPosition;
    const [startLat, startLng] = currentRef.current || targetPosition;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const startTime = performance.now();
    const duration = 1200;

    const animate = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = t * (2 - t);

      const lat = startLat + (targetLat - startLat) * eased;
      const lng = startLng + (targetLng - startLng) * eased;

      currentRef.current = [lat, lng];
      if (markerRef.current) {
        markerRef.current.setLatLng(currentRef.current);
      }

      if (t < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetPosition]);

  return (
    <MapContainer center={center} zoom={15} className="map-wrap">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        ref={(ref) => {
          if (ref) markerRef.current = ref;
        }}
        position={currentRef.current || center}
        icon={ambulanceIcon}
      />
      <AutoCenter position={currentRef.current || center} />
    </MapContainer>
  );
}
