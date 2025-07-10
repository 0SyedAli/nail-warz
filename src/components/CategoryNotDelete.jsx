function CategoryNotDelete() {
  return (
    <div
      className="modal fade"
      id="categorynotdelete"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog aus_dialog cd_dialog h-100 d-flex align-items-center">
        <div className="modal-content">
          <div className="modal-body pt-5 pb-4 px-3">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >X</button>
            <h3>
              This category cannot be deleted due to used in the particular
              product.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryNotDelete;
