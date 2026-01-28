"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import AreYouSure2 from "@/components/Modal/AreYouSure2";
import { useDisclosure } from "@chakra-ui/react";
import AddCategory from "@/components/Modal/AddCategory";
import { FaExclamationCircle } from "react-icons/fa";

const productImagePlaceholder = "/images/nail-cat.jpg";
const ManageCategory = () => {
  const popoverRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen: isNotfOpen, onOpen: onNotfOpen, onClose: onNotfClose } = useDisclosure();
  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/auth/login");

    try {
      const u = JSON.parse(cookie);
      if (u?._id) setAdminId(u._id);
      else router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  }, []);

  useEffect(() => {
    if (adminId) getCategories();
  }, [adminId]);

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getSalonCategory?salonId=${adminId}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        throw new Error(data.msg || "Failed to fetch categories.");
      }
    } catch (err) {
      const message = err?.message || "Failed to load categories.";
      setError(message);
      toast.error(message, {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (catId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteSalonCategory`,
        {
          categoryId: catId,
        }
      );
      if (response?.data?.success) {
        toast.success("Category deleted successfully", {
          autoClose: 1500,
        });
        console.log("Category deleted successfully");
        getCategories();
      } else {
        throw new Error(response?.data?.msg || "Failed to delete category");
      }
    } catch (err) {
      const message = err?.message || "Error deleting category.";
      toast.error(message, {
        autoClose: 1500,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const renderCategories = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (categories.length === 0) return <p>No categories found.</p>;

    return (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xxl-5 g-3">
        {categories.map((category) => (
          <div className="col" key={category._id}>
            <div className="product_card">
              {/* <Image
                width={255}
                height={100}
                className="product_image"
                src={productImagePlaceholder}
                alt="category image"
              /> */}
              <div className="text-center mt-3">
                <h4 className="my-3">{category.categoryName}</h4>
                <button
                  className="button_detele"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#areyousure2"
                  onClick={() => setCategoryToDelete(category._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <div className="page">
        <div className="manage_order_head pb-3">
          <div>
            <div className="position-relative w-100 d-inline-flex align-items-center gap-1">
              <h3 className="d-flex align-items-center gap-2 mb-0" style={{width:"500px"}}>
                All Categories
                <FaExclamationCircle
                  color="#000"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpen(!open)}
                />
              </h3>

              {open && (
                <div ref={popoverRef} className="filter-popover filter-popover2">
                  These are service categories which will categorize the services a Salon provide in the Salon Profile. You can choose any category you want the service to be highlighted under while adding a new Service and you can change them as well.
                </div>
              )}
            </div>
          </div>
          <div onClick={onNotfOpen} className="btn btntheme3">
            Add Category
          </div>
        </div>
        <div className="manage_order_body">{renderCategories()}</div>
      </div>
      <AddCategory
        btntitle="Add now"
        isOpen={isNotfOpen}
        onClose={onNotfClose}
        onSuccess={getCategories} // 🔥 pass the callback
      />
      <AreYouSure2
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </>
  );
};

export default ManageCategory;
