const { IoIosStar } = require("react-icons/io");

export default function RatingStars({ rating, reviews }) {
  return (
    <div className="stars d-flex align-items-center gap-2">
      {[...Array(5)].map((_, i) => (
        <IoIosStar key={i} color={i < rating ? "#FFC633" : "#ccc"} size={25} />
      ))}
    </div>
  )
};

