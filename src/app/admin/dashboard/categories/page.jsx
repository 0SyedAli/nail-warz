"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import AreYouSure2 from "@/components/Modal/AreYouSure2";
import { useDisclosure } from "@chakra-ui/react";
import AddCategory from "@/components/Modal/AddFilterCategory";
import { FaExclamationCircle } from "react-icons/fa";
import { MdOutlineEdit, MdHistory } from "react-icons/md";
import { HiOutlineArchive } from "react-icons/hi";
import BallsLoading from "@/components/Spinner/BallsLoading";
import { useRouter } from "next/navigation";
import { IoMdAdd, IoMdClose } from "react-icons/io";

const ManageCategory = () => {
  const popoverRef = useRef(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();

  useEffect(() => {
    const cookie = Cookies.get("user");
    if (!cookie) return router.push("/admin/auth/login");
    getCategories();
  }, [showArchived]);

  const getCategories = async () => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/getAllCategories${showArchived ? "?isArchive=true" : ""}`;
      const response = await fetch(url);
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
      toast.error(message, { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (catId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteCategory`,
        { categoryId: catId }
      );
      if (response?.data?.success) {
        toast.success("Category deleted successfully", { autoClose: 1500 });
        getCategories();
      } else {
        throw new Error(response?.data?.msg || "Failed to delete category");
      }
    } catch (err) {
      const message = err?.message || "Error deleting category.";
      toast.error(message, { autoClose: 1500 });
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    onFormOpen();
  };

  const handleAdd = () => {
    setEditingCategory(null);
    onFormOpen();
  };

  const renderCategories = () => {
    if (loading) return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <BallsLoading />
      </div>
    );

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (categories.length === 0) return (
      <div className="text-center py-5">
        <p className="text-muted">No {showArchived ? "archived" : "active"} categories found.</p>
      </div>
    );

    return (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xxl-4 g-4">
        {categories.map((category) => (
          <div className="col" key={category._id}>
            <div className={`card h-100 border-0 rounded-4 overflow-hidden position-relative category-card ${category.isArchive ? 'bg-light' : ''}`} style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold mb-0 text-dark">{category.categoryName}</h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-light btn-sm rounded-circle p-2 shadow-sm"
                      onClick={() => handleEdit(category)}
                      title="Edit Category"
                    >
                      <MdOutlineEdit size={18} />
                    </button>
                    {/* <button
                      className="btn btn-outline-danger btn-sm rounded-circle p-2 shadow-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#areyousure2"
                      onClick={() => setCategoryToDelete(category._id)}
                      title="Delete Category"
                    >
                      <IoMdClose size={18} />
                    </button> */}
                  </div>
                </div>

                <p className="text-muted small mb-3 text-truncate-2" style={{ minHeight: '40px' }}>
                  {category.description || "No description provided."}
                </p>

                <div className="mt-auto">
                  <p className="mb-2 small fw-semibold text-uppercase text-secondary" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                    Subcategories ({category.subCategories?.length || 0})
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {category.subCategories && category.subCategories.length > 0 ? (
                      category.subCategories.slice(0, 5).map((sub, i) => (
                        <span key={i} className="badge bg-soft-danger text-danger fw-medium py-2 px-2 rounded-pill border border-danger border-opacity-50">
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted small italic">None</span>
                    )}
                    {category.subCategories && category.subCategories.length > 5 && (
                      <span className="badge bg-light text-muted fw-normal py-1 px-2 rounded-pill border">
                        +{category.subCategories.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* {category.isArchive && (
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-10 d-flex align-items-center justify-content-center" style={{ pointerEvents: 'none' }}>
                  <span className="badge bg-warning text-dark shadow-sm">Archived</span>
                </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    );
  };

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
        <div className="manage_order_head pb-4 border-bottom mb-4">
          <div className="d-flex align-items-center gap-3 position-relative">
            <h3 className="fw-bold mb-0">Category Management</h3>
            <FaExclamationCircle
              color="#6c757d"
              style={{ cursor: "pointer" }}
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div ref={popoverRef} className="filter-popover shadow-lg rounded-4 p-3 border" style={{ top: "40px" }}>
                Categories are discovery tags used in the Nail Warz app. Super Admin manages this list to maintain consistency. Vendors select from these approved categories.
              </div>
            )}
          </div>

          <div className="d-flex align-items-center gap-3 mt-3 mt-sm-0">
            <div className="btn-group rounded-pill overflow-hidden border shadow-sm" role="group">
              <button
                type="button"
                className={`btn btn-sm px-4 py-2 ${!showArchived ? 'btn-dark' : 'btn-light'}`}
                onClick={() => setShowArchived(false)}
              >
                Active
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 py-2 ${showArchived ? 'btn-dark' : 'btn-light'}`}
                onClick={() => setShowArchived(true)}
              >
                Archived
              </button>
            </div>

            <button onClick={handleAdd} className="btn btntheme3 d-flex align-items-center gap-2">
              <IoMdAdd size={20} />
              Add Category
            </button>
          </div>
        </div>

        <div className="manage_order_body">{renderCategories()}</div>
      </div>

      <AddCategory
        btntitle="Add Category"
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSuccess={getCategories}
        initialData={editingCategory}
      />

      <AreYouSure2
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
        title="Delete Category"
        message="Are you sure you want to permanently delete this category? This action cannot be undone."
      />

      <style jsx>{`
        .bg-soft-primary {
          background-color: rgba(13, 110, 253, 0.08);
        }
        .category-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .filter-popover {
          position: absolute;
          z-index: 1000;
          background: white;
          max-width: 300px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default ManageCategory;
