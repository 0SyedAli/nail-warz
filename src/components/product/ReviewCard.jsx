import RatingStars from "./RatingStars";

export default function ReviewCard() {
  return (
    <div className="review-card p-4 h-100">

      <div className="d-flex justify-content-between align-items-start mb-2">
        <RatingStars rating={4.5} />

        <span className="text-muted">•••</span>
      </div>

      <h6 className="fw-semibold mb-1">
        Samantha D. <span className="verified-badge">✔</span>
      </h6>

      <p className="review-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation.
      </p>

      <small className="text-muted">
        Posted on August 14, 2025
      </small>
    </div>
  );
}
