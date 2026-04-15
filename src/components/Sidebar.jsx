export default function Sidebar({ title, items, selected, onSelect }) {
  return (
    <aside className="sidebar">
      <h2>{title}</h2>
      {items.map((item) => (
        <button
          key={item}
          className={`nav-btn ${selected === item ? 'active' : ''}`}
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </aside>
  );
}
