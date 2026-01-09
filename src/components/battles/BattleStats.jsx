export default function BattleStats({ battles }) {
  const totalVotes = battles.reduce((s, b) => s + (b.totalVotes || 0), 0);

  return (
    <div className="row g-3 mb-4">
      <Stat title="Total Battles" value={battles.length} />
      <Stat title="Active Battles" value={battles.filter(b => b.status === "active").length} />
      <Stat title="Upcoming Battles" value={battles.filter(b => b.status === "upcoming").length} />
      <Stat title="Total Votes" value={totalVotes} valueClass="text-primary" />
    </div>
  );
}

const Stat = ({ title, value, valueClass = "" }) => (
  <div className="col-md-3">
    <div className="card h-100">
      <div className="card-body">
        <p className="text-muted mb-1">{title}</p>
        <h5 className={`fw-bold ${valueClass}`}>{value}</h5>
      </div>
    </div>
  </div>
);
