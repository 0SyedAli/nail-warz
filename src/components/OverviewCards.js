// const img1 = "/images/user1.png";

const OverviewCards = ({ ovimg }) => {
  return (
    <div className="OverviewCards">
      <img src={ovimg} alt="User" />
      <p>Today Earning</p>
      <h2>$984.42</h2>
      <h5>
        +$120.5 <span>Today</span>
      </h5>
    </div>
  );
};

export default OverviewCards;
