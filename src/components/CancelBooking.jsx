function CancelBooking({ onConfirm, couponId }) {
  return (
    <>
      <div
        className="modal fade"
        id="cancel-booking"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel3"
        aria-hidden="true"
      >
        <div className="modal-dialog appoint_detail">
          <div className="modal-content">
            <div className="modal-body">
              <h3 className="px-4 pb-4">Cancel Booking</h3>
              <p>Cancel your booking anytime.</p>
              <div className="aus_btns d-flex align-items-center justify-content-center gap-3">
                <button className="themebtn4 red btn" data-bs-dismiss="modal">Confirm</button>
                <button
                  className="btn themebtn4 green"
                  onClick={onConfirm}
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CancelBooking;