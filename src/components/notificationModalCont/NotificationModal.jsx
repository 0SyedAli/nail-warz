import Link from "next/link";
const ticket = "/images/ticket.png";

function NotificationModal() {
  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog noti-modal-dialog">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="noti_modal_container_body">
                <div className="notify_item">
                  <div className="noti_icon">
                    <img src={ticket} alt="ticket icon" />
                  </div>
                  <div className="">
                    <div>
                      <h5>Received Unique Code</h5>
                      <p>
                        Congratulations! You received a code.{" "}
                        <Link href="/">Click here</Link>
                      </p>
                    </div>
                    <p className="pt-4">
                      <span>2 minutes ago</span>
                    </p>
                  </div>
                </div>
                <div className="notify_item">
                  <div className="noti_icon">
                    <img src={ticket} alt="ticket icon" />
                  </div>
                  <div className="">
                    <div>
                      <h5>Received Unique Code</h5>
                      <p>
                        Congratulations! You received a code.{" "}
                        <Link href="/">Click here</Link>
                      </p>
                    </div>
                    <p className="pt-4">
                      <span>2 minutes ago</span>
                    </p>
                  </div>
                </div>
                <div className="notify_item">
                  <div className="noti_icon">
                    <img src={ticket} alt="ticket icon" />
                  </div>
                  <div className="">
                    <div>
                      <h5>Received Unique Code</h5>
                      <p>
                        Congratulations! You received a code.{" "}
                        <Link href="/">Click here</Link>
                      </p>
                    </div>
                    <p className="pt-4">
                      <span>2 minutes ago</span>
                    </p>
                  </div>
                </div>
                <div className="notify_item">
                  <div className="noti_icon">
                    <img src={ticket} alt="ticket icon" />
                  </div>
                  <div className="">
                    <div>
                      <h5>Received Unique Code</h5>
                      <p>
                        Congratulations! You received a code.{" "}
                        <Link href="/">Click here</Link>
                      </p>
                    </div>
                    <p className="pt-4">
                      <span>2 minutes ago</span>
                    </p>
                  </div>
                </div>
                <div className="modal-footer noti_modal_container_footer">
                  <button type="button" className="border-0 bg-transparent">
                    Mark as read
                  </button>
                  <button
                    onClick={() =>
                      (window.location = "/dashboard/allnotification")
                    }
                    className="border-0 bg-transparent"
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationModal;
