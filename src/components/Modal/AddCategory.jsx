"use client";

import Modal from "./layout";
import "./modal.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function AddCategory({ isOpen, onClose, btntitle, onSuccess }) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [salonId, setSalonId] = useState(null);
  const router = useRouter();

  // Fetch salonId from cookie
  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/auth/login");

    try {
      const u = JSON.parse(cookie);
      if (u?._id) setSalonId(u._id);
      else router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // 🔥 prevent double click

    setIsLoading(true);

    if (!categoryName.trim()) {
      setError("Please enter category name");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/createSalonCategory`,
        {
          salonId: salonId,
          categoryName: categoryName.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        toast.success("Category created successfully!", {
          autoClose: 1500,
        });
        router.refresh();
        onClose();
        onSuccess?.();       // 🔥 refresh categories list
      } else {
        toast.error(response?.data?.message || "Failed to create category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "API error", {
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
      setCategoryName("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="AddCategory_modal_body">
        <div className="d-flex align-items-center justify-content-between">
          <h3>Create Category</h3>

          <button
            type="button"
            className="btn-close"
            onClick={() => {
              onClose();
              setCategoryName("");
              setError(null);
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ margin: "35px 0 40px" }}>
            <label className="mb-2">Category Name</label>
            <input
              type="text"
              className="form-control input_field2"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="sort_btn justify-content-end gap-2">
            <button
              type="button"
              className="themebtn4 green btn"
              onClick={() => {
                onClose();
                setCategoryName("");
                setError(null);
              }}
            >
              Cancel
            </button>

            {/* 🔥 Removed AuthBtn — Now using a normal submit button */}
            <button
              type="submit"
              className="themebtn4 green btn"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : btntitle}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddCategory;
