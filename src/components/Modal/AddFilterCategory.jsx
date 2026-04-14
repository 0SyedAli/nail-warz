"use client";
import Modal from "./layout";
import "./modal.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { IoMdClose, IoMdAdd } from "react-icons/io";

function AddCategory({ isOpen, onClose, btntitle, onSuccess, initialData = null }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState("");
  const [isArchive, setIsArchive] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const router = useRouter();

  const isEdit = !!initialData;

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/admin/auth/login");

    try {
      const u = JSON.parse(cookie);
      if (u?._id) setAdminId(u._id);
      else router.push("/admin/auth/login");
    } catch {
      router.push("/admin/auth/login");
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.categoryName || "");
      setDescription(initialData.description || "");
      setSubCategories(initialData.subCategories || []);
      setIsArchive(initialData.isArchive || false);
    } else {
      setCategoryName("");
      setDescription("");
      setSubCategories([]);
      setIsArchive(false);
    }
  }, [initialData, isOpen]);

  const addSubCategory = () => {
    if (newSubCategory.trim() && !subCategories.includes(newSubCategory.trim())) {
      setSubCategories([...subCategories, newSubCategory.trim()]);
      setNewSubCategory("");
    }
  };

  const removeSubCategory = (index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    if (!isEdit && !categoryName.trim()) {
      setError("Please enter category name");
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (isEdit) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/updateCategory`,
          {
            categoryId: initialData._id,
            description: description.trim(),
            isArchive,
            subCategories,
            // categoryName: categoryName.trim(), // Optional if backend supports it
          },
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/createCategory`,
          {
            superAdminId: adminId,
            categoryName: categoryName.trim(),
            description: description.trim(),
            subCategories,
          },
          { headers: { "Content-Type": "application/json" } }
        );
      }

      if (response?.data?.success) {
        toast.success(`${isEdit ? "Category updated" : "Category created"} successfully!`, {
          autoClose: 1500,
        });
        onClose();
        onSuccess?.();
      } else {
        toast.error(response?.data?.message || "Failed to save category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "API error", {
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="AddCategory_modal_body p-1">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="fw-bold mb-0">{isEdit ? "Edit Category" : "Add Category"}</h3>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              onClose();
              setError(null);
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Category Name</label>
            <input
              type="text"
              className="form-control input_field2"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={isEdit} // Following user provided schema for updateCategory
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Description</label>
            <textarea
              className="form-control input_field2"
              placeholder="Enter description"
              style={{ height: "80px", paddingTop: "10px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Subcategories</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                className="form-control input_field2"
                placeholder="Add subcategory"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSubCategory())}
              />
              <button
                type="button"
                className="btn btntheme3 p-2 d-flex align-items-center justify-content-center"
                style={{ width: "45px", height: "45px" }}
                onClick={addSubCategory}
              >
                <IoMdAdd size={24} />
              </button>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {subCategories.map((sub, index) => (
                <span
                  key={index}
                  className="badge bg-light text-dark border d-flex align-items-center gap-1 p-2 rounded-3"
                  style={{ fontSize: "14px", fontWeight: "400" }}
                >
                  {sub}
                  <IoMdClose
                    size={16}
                    style={{ cursor: "pointer" }}
                    onClick={() => removeSubCategory(index)}
                  />
                </span>
              ))}
            </div>
          </div>

          {isEdit && (
            <div className="mb-4 form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="archiveSwitch"
                checked={isArchive}
                onChange={(e) => setIsArchive(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="archiveSwitch">
                Archive Category
              </label>
            </div>
          )}

          {error && <p className="text-danger small">{error}</p>}

          <div className="sort_btn justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 h-45 rounded-pill"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4 h-45 rounded-pill"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : isEdit ? "Update" : btntitle}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddCategory;

