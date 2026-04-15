const colorMap = {
  AVAILABLE: 'status available',
  BUSY: 'status busy',
  OFFLINE: 'status offline'
};

export default function StatusBadge({ status = 'OFFLINE' }) {
  return <span className={colorMap[status] || 'status'}>{status}</span>;
}
