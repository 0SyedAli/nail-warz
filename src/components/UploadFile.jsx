"use client";
import Image from "next/image";
import { useState } from "react";
const uploadImg = "/images/solar_upload-linear.png";

export const FileUpload = ({title}) => {
  const [files, setFiles] = useState([]);
  const [fileEnter, setFileEnter] = useState(false);

  const handleFiles = (newFiles) => {
    const fileArray = [...newFiles].map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setFiles((prevFiles) => [...prevFiles, ...fileArray]);
  };
  return (
    <div className="d-flex flex-wrap gap-2">
      {files.map((file, index) => (
        <div key={index}>
          <Image
            src={file.url}
            alt={file.name}
            className="img-fluid rounded"
            style={{ maxWidth: "100%", height: "110px", objectFit: "cover" }}
          />
          {/* <button
              onClick={() =>
                setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
              }
              className="btn btn-danger btn-sm mt-2"
            >
              Remove
            </button> */}
        </div>
      ))}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setFileEnter(true);
        }}
        onDragLeave={() => {
          setFileEnter(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setFileEnter(false);
          const droppedFiles = e.dataTransfer.files;
          if (droppedFiles.length) {
            handleFiles(droppedFiles);
          }
        }}
        className={`upload_btn ${
          fileEnter ? "border-primary border-4" : "border-secondary border-2"
        } bg-light d-flex flex-column align-items-center justify-content-center text-center rounded`}
      >
        <img src={uploadImg} alt="" />
        <label htmlFor={`file_${title}`} className="">
          Drag & Drop or <a className="">Choose File</a> to upload
        </label>
        <input
          id={`file_${title}`}
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files.length) {
              handleFiles(e.target.files);
            }
          }}
        />
        <p>JPG, PNG.</p>
      </div>
    </div>
  );
};
