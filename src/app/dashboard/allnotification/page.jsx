import Link from "next/link";

const ticket = "/images/ticket.png";
const AllNotification = () => {
  return (
    <div className="page">
      <div className="manage_order_head pb-2">
        <h3>All Notifications</h3>
      </div>
      <div className="allNotification_body">
        <div className="notify_item">
          <div className="noti_icon">
            <img src={ticket} alt="ticket icon" />
          </div>
          <div className="d-flex justify-content-between w-100">
            <div>
              <h5>Received Unique Code</h5>
              <p>
                Congratulations! You received a code.{" "}
                <Link href="/">Click here</Link>
              </p>
            </div>
            <p className="">
              <span>2 minutes ago</span>
            </p>
          </div>
        </div>
        <div className="notify_item">
          <div className="noti_icon">
            <img src={ticket} alt="ticket icon" />
          </div>
          <div className="d-flex justify-content-between w-100">
            <div>
              <h5>Received Unique Code</h5>
              <p>
                Congratulations! You received a code.{" "}
                <Link href="/">Click here</Link>
              </p>
            </div>
            <p className="">
              <span>10 minutes ago</span>
            </p>
          </div>
        </div>
        <div className="notify_item">
          <div className="noti_icon">
            <img src={ticket} alt="ticket icon" />
          </div>
          <div className="d-flex justify-content-between w-100">
            <div>
              <h5>Received Unique Code</h5>
              <p>
                Congratulations! You received a code.{" "}
                <Link href="/">Click here</Link>
              </p>
            </div>
            <p className="">
              <span>1 hour ago</span>
            </p>
          </div>
        </div>
        <div className="notify_item">
          <div className="noti_icon">
            <img src={ticket} alt="ticket icon" />
          </div>
          <div className="d-flex justify-content-between w-100">
            <div>
              <h5>Received Unique Code</h5>
              <p>
                Congratulations! You received a code.{" "}
                <Link href="/">Click here</Link>
              </p>
            </div>
            <p className="">
              <span>10 hours ago</span>
            </p>
          </div>
        </div>
        <div className="notify_item">
          <div className="noti_icon">
            <img src={ticket} alt="ticket icon" />
          </div>
          <div className="d-flex justify-content-between w-100">
            <div>
              <h5>Received Unique Code</h5>
              <p>
                Congratulations! You received a code.{" "}
                <Link href="/">Click here</Link>
              </p>
            </div>
            <p className="">
              <span>2 days ago</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllNotification;
