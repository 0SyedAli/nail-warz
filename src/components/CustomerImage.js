import { useEffect, useState } from "react";
import Image from "next/image";

export default function CustomerImage({ order }) {
  const [imageUrl, setImageUrl] = useState("/images/default-avatar.png");

  useEffect(() => {
    if (order.userId?.profileImage) {
      const testUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${order.userId?.profileImage}`;
      fetch(testUrl, { method: "HEAD" })
        .then((res) => {
          if (res.ok) {
            setImageUrl(testUrl); // File exists
          }
        })
        .catch(() => {
          // do nothing, fallback stays
        });
    }
  }, [order]);

  return (
    <Image
      src={imageUrl}
      alt={order.userId?.fullName || "Image"}
      className="rounded-circle"
      width={40}
      height={40}
      unoptimized
    />
  );
}
