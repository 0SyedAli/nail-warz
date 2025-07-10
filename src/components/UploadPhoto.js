"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function UploadPhoto() {
  const [selectedImage, setSelectedImage] = useState(null); // Store selected image

  // Handle file input change and preview the selected image
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for image preview
      setSelectedImage(imageUrl); // Set the image URL to preview
    }
  };

  return (
    <div style={styles.container}>
      {selectedImage ? (
        <div style={styles.imageContainer}>
          <img src={selectedImage} alt="Selected" style={styles.imagePreview} />
        </div>
      ) : (
        <img
          src="../../images/profile.png"
          alt="Selected"
          style={styles.ImageDummy}
        />
      )}
      <input
        type="file"
        accept="image/*"
        style={styles.input}
        onChange={handleImageChange}
      />
      <div style={styles.add_icon}>
        <FaPlus />
      </div>
    </div>
  );
}

// Optional inline styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
    width: "124px",
    height: "124px",
    outline: "1px solid #000",
    textAlign: "center",
    borderRadius: "100%",
    margin: "20px auto 50px",
    position: "relative",
  },
  imagePreview: {
    width: "124px",
    height: "124px",
    objectFit: "cover",
    borderRadius: "50%",
    padding: "0.2px",
    position: "relative",
    zIndex: "2",
  },
  ImageDummy: {
    width: "40px",
    height: "40px",
    margin: " auto auto",
  },
  input: {
    width: "100%",
    height: "100%",
    opacity: "0",
    cursor: "pointer",
    position: "absolute",
    zIndex:'111'
  },
  add_icon: {
    position: "absolute",
    bottom: "-10px",
    right: "-5px",
    background: "#FFF",
    borderRadius: "100%",
    display: "Flex",
    alignItems: "center",
    justifyContent: "center",
    width: "43px",
    height: "43px",
    boxShadow: "rgba(149, 157, 165, 0.3) -1px 5px 23px",
    zIndex:'2',
    fontSize:'20px'
  },
};
