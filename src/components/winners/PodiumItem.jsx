export default function PodiumItem({ data, className}) {
    return (
        <div className={`reward-names ${className}`}>
            <h6>{data.name}</h6>
            <h3>{data.votes}</h3>
        </div>
    );
}
