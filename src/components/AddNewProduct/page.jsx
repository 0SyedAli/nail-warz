"use client";
import Link from "next/link";
import InputField from "../Form/InputField";
import { FileUpload } from "../UploadFile";
import { useState } from "react";

export const AddNewProduct = ({ title, btntitle }) => {
  const [files, setFiles] = useState([]);
  const handleFiles = (t, newFiles, state, setState) => {
    const fileArray = [...newFiles].map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setState((prevState) => [...prevState, ...fileArray]);
  };

  return (
    <div className="add_new_product">
      {/* Multiple FileUpload Components */}
      <FileUpload
        title={title}
        state={files}
        setState={setFiles}
        handleFiles={handleFiles}
      />

      <form action="/">
        <div className="row">
          <div className="col-6">
            <label htmlFor="name">Name</label>
            <InputField
              type="text"
              placeholder="Orange Juice"
              id="name"
              classInput="classInput"
            />
          </div>
          <div className="col-6">
            <label htmlFor="stock">Stock Quantity</label>
            <InputField
              type="number"
              placeholder="45"
              id="stock"
              classInput="classInput"
            />
          </div>
          <div className="col-6">
            <label htmlFor="discount">Set Discount</label>
            <InputField
              type="text"
              placeholder="%"
              id="discount"
              classInput="classInput"
            />
          </div>
          <div className="col-6">
            <label htmlFor="price">Price</label>
            <InputField
              type="text"
              placeholder="$500"
              id="price"
              classInput="classInput"
            />
          </div>
          <div className="col-6">
            <label htmlFor="category">Category</label>
            <InputField
              type="text"
              placeholder="Category Name"
              id="category"
              classInput="classInput"
            />
          </div>
          <div className="col-6">
            <label htmlFor="brand">Brand Name</label>
            <InputField
              type="text"
              placeholder="Jack Daniel"
              id="brand"
              classInput="classInput"
            />
          </div>
        </div>
        <div className="product_bottom">
          <div className="form-check form-switch">
            <label className="form-check-label" htmlFor="inStock">
              In Stock
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="inStock"
            />
          </div>
          {btntitle && (
            <button type="button" className="themebtn4 green btn">
              {btntitle}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
