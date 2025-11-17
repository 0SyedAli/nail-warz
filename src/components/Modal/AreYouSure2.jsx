function AreYouSure2({ onConfirm, onCancel }) {
  return (
    <div
      className="modal fade"
      id="areyousure2"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered delete_modal_dialog">
        <div className="modal-content">
          <div className="modal-body">
            <h3 className="px-4 pb-4 text-center">
              Are you sure you want to delete this category?
            </h3>

            <div className="aus_btns d-flex align-items-center justify-content-center gap-3">
              <button
                className="themebtn4 red btn"
                onClick={onCancel}
                data-bs-dismiss="modal"
              >
                No
              </button>

              <button
                className="themebtn4 green btn"
                onClick={onConfirm}
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AreYouSure2;
