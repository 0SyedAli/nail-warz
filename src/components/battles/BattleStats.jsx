import { RiSwordLine } from "react-icons/ri";
import { SiBattledotnet } from "react-icons/si";
import { GiBattleAxe } from "react-icons/gi";
import { MdOutlineHowToVote } from "react-icons/md";

export default function BattleStats({ battles }) {
  const activeBattles = battles.filter(b => b.status === "active");
  const totalVotes = battles.reduce((s, b) => s + (b.totalVotes || 0), 0);
  const activeParticipants = activeBattles.reduce(
    (total, battle) => total + (battle.participants?.length || 0),
    0
  );
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-3 mb-4">
      <Stat title="Total Battles" icon={RiSwordLine} value={battles.length} />
      <Stat title="Active Battles" icon={SiBattledotnet} participants={activeParticipants} value={battles.filter(b => b.status === "active").length} />
      {/* <Stat title="Active Battle Participants" value={activeParticipants} valueClass="text-success" /> */}
      <Stat title="Upcoming Battles" icon={GiBattleAxe} value={battles.filter(b => b.status === "upcoming").length} />
      <Stat title="Total Votes" icon={MdOutlineHowToVote} value={totalVotes} valueClass="text-primary" />
    </div>
  );
}

const Stat = ({ title, value, participants, icon: Icon, valueClass = "" }) => (
  <div className="col">
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <p className="text-muted mb-1">{title}</p>
          <div className={`icon-box `}>
            <Icon />
          </div>
        </div>
        <h5 className={`fw-bold ${valueClass}`}>{value}</h5>
        {title == "Active Battles" &&
          <span className="text-success small">Participants {`(${participants})`}</span>
        }
      </div>
    </div>
  </div>
);
