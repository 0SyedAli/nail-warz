const TransactionHistory = () => {
  return (
    <div className="page">
      <div className="dash_head2">
        <h3>All Transactions</h3>
        <div className="dash_head2_select">
          <select class="form-select" aria-label="Default select example">
            <option selected>sort by month</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
          <select class="form-select" aria-label="Default select example">
            <option selected>sort by date</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
      </div>
      <div className="transaction_body">
        <div className="transaction_item">
          <div className="d-flex flex-column">
            <h5>Received from James Wilson</h5>
            <div className="d-flex align-items-center gap-3">
              <h6>July 17, 2024</h6>
              <h6>Order ID : #456789</h6>
            </div>
          </div>
          <h3>+$5,000.00</h3>
        </div>
        <div className="transaction_item">
          <div className="d-flex flex-column">
            <h5>Received from James Wilson</h5>
            <div className="d-flex align-items-center gap-3">
              <h6>July 17, 2024</h6>
              <h6>Order ID : #456789</h6>
            </div>
          </div>
          <h3>+$5,000.00</h3>
        </div>
        <div className="transaction_item">
          <div className="d-flex flex-column">
            <h5>Received from James Wilson</h5>
            <div className="d-flex align-items-center gap-3">
              <h6>July 17, 2024</h6>
              <h6>Order ID : #456789</h6>
            </div>
          </div>
          <h3>+$5,000.00</h3>
        </div>
        <div className="transaction_item">
          <div className="d-flex flex-column">
            <h5>Received from James Wilson</h5>
            <div className="d-flex align-items-center gap-3">
              <h6>July 17, 2024</h6>
              <h6>Order ID : #456789</h6>
            </div>
          </div>
          <h3>+$5,000.00</h3>
        </div>
        <div className="transaction_item">
          <div className="d-flex flex-column">
            <h5>Received from James Wilson</h5>
            <div className="d-flex align-items-center gap-3">
              <h6>July 17, 2024</h6>
              <h6>Order ID : #456789</h6>
            </div>
          </div>
          <h3>+$5,000.00</h3>
        </div>
        <div className="transaction_item">
          <div className="d-flex flex-column">
            <h5>Received from James Wilson</h5>
            <div className="d-flex align-items-center gap-3">
              <h6>July 17, 2024</h6>
              <h6>Order ID : #456789</h6>
            </div>
          </div>
          <h3>+$5,000.00</h3>
        </div>
        <div className="transaction_item">
          <div className="d-flex flex-column">
            <h5>Received from James Wilson</h5>
            <div className="d-flex align-items-center gap-3">
              <h6>July 17, 2024</h6>
              <h6>Order ID : #456789</h6>
            </div>
          </div>
          <h3>+$5,000.00</h3>
        </div>
        <div className="transaction_item">
          <div className="d-flex flex-column">
            <h5>Received from James Wilson</h5>
            <div className="d-flex align-items-center gap-3">
              <h6>July 17, 2024</h6>
              <h6>Order ID : #456789</h6>
            </div>
          </div>
          <h3>+$5,000.00</h3>
        </div>
        <div className="pagination justify-content-end mt-4">
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>&gt;&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
