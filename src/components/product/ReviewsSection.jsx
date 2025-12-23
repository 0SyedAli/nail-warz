import ReviewCard from "./ReviewCard";

export default function ReviewsSection() {
  return (
    <div className="reviews-section">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">All Reviews <span className="text-muted">(451)</span></h5>

        <div className="d-flex gap-2 align-items-center btn-write-container">
          <button className="btn btn-light rounded-circle">
            ☰
          </button>

          <select className="form-select form-select-sm review-select">
            <option>Latest</option>
            <option>Oldest</option>
            <option>Highest Rating</option>
          </select>

          <button className="btn btn-dark rounded-pill px-4 text-nowrap">
            Write a Review
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="row g-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="col-md-6">
            <ReviewCard />
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-5">
        <button className="btn btn-outline-secondary rounded-pill px-4">
          Load More Reviews
        </button>
      </div>

    </div>
  );
}
