import BattleEntryCard from "./BattleEntryCard";

export default function ActiveBattles({ title }) {
  return (
    <div className="py-5">
      <h3 className="fw-bold mb-3 battle-title2">{title} Battles</h3>

      <div className="active-battle-card">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="battle-title2 mb-1">Galaxy Nails Battle Entries</h5>
            <small className="text-muted">Ends on Nov 5, 2025</small>
          </div>

          <span className="live-badge">● Live</span>
        </div>

        <div className="d-flex gap-3 overflow-auto pb-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <BattleEntryCard key={i} />
          ))}
        </div>

        <button className="btn active-battle-btn ">
          VIEW THE SCORE BOARD
        </button>

      </div>
    </div>
  );
}
