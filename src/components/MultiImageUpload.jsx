"use client";

import Image from "next/image";
import { BsTrash, BsUpload } from "react-icons/bs";

export default function MultiImageUpload({ images = [], setImages }) {

  const safeImages = Array.isArray(images) ? images : [];

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // 🔥 REPLACE old previews with new images
    setImages(files);

    e.target.value = "";
  };

  const removeImage = (index) => {
    const updated = safeImages.filter((_, i) => i !== index);
    setImages(updated); // ✅ ARRAY ONLY
  };

  return (
    <div className="multi-image-upload">

      <label className="upload-box">
        <BsUpload />
        <span>Upload Images</span>
        <input
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={handleSelect}
        />
      </label>

      <div className="image-preview-grid">
        {safeImages.map((img, index) => (
          <div key={index} className="image-thumb">
            <Image
              src={
                typeof img === "string"
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`
                  : URL.createObjectURL(img)
              }
              alt="product"
              width={80}
              height={80}
            />
            <button onClick={() => removeImage(index)}>
              <BsTrash />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
