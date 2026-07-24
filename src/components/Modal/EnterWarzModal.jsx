"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import Modal from "./layout";
import { BsUpload, BsTrash } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import "./EnterWarzModal.css";

export default function EnterWarzModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    nailTechnicianName: "",
    salonName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    socialPlatform: "instagram",
    socialHandle: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Filter to ensure we only have images
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      showErrorToast("Only image files are allowed");
    }

    setForm((prev) => {
      const updatedImages = [...prev.images, ...imageFiles].slice(0, 5); // Max 5 images
      if (updatedImages.length > 0 && errors.images) {
        setErrors((errs) => ({ ...errs, images: "" }));
      }
      return { ...prev, images: updatedImages };
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!form.name.trim()) {
      tempErrors.name = "Full Name is required";
    } else if (form.name.trim().length < 3) {
      tempErrors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!form.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (form.phone.trim().length < 7) {
      tempErrors.phone = "Please enter a valid phone number";
    }
    if (!form.nailTechnicianName.trim()) {
      tempErrors.nailTechnicianName = "Nail Technician Name is required";
    }

    if (!form.salonName.trim()) {
      tempErrors.salonName = "Salon Name is required";
    }
    if (!form.address.trim()) {
      tempErrors.address = "Address/Location is required";
    }

    if (!form.description.trim()) {
      tempErrors.description = "Description/Bio is required";
    } else if (form.description.trim().length < 10) {
      tempErrors.description = "Description must be at least 10 characters";
    }

    if (!form.socialHandle.trim()) {
      tempErrors.socialHandle = "Social handle is required";
    }

    if (form.images.length === 0) {
      tempErrors.images = "At least one image of your artwork is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showErrorToast("Please fix the validation errors in the form");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("nailTechnicianName", form.nailTechnicianName.trim());
      formData.append("salonName", form.salonName.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("address", form.address.trim());
      formData.append("description", form.description.trim());

      // Format handle to always start with '@' if not already present
      let handle = form.socialHandle.trim();
      if (!handle.startsWith("@")) {
        handle = "@" + handle;
      }

      const socialData = {
        name: handle,
        platform: form.socialPlatform,
      };
      formData.append("social", JSON.stringify(socialData));

      // Append all images
      form.images.forEach((image) => {
        formData.append("images", image);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const token = Cookies.get("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      // API call
      const res = await axios.post("/superAdmin/content", formData, config);

      if (res.data?.success || res.status === 200 || res.status === 211) {
        showSuccessToast("Successfully entered the Warz! Your submission is under review.");

        // Reset form
        setForm({
          name: "",
          nailTechnicianName: "",
          salonName: "",
          email: "",
          phone: "",
          address: "",
          description: "",
          socialPlatform: "instagram",
          socialHandle: "",
          images: [],
        });
        setErrors({});
        onClose();
      } else {
        showErrorToast(res.data?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Enter the Warz submit error:", err);
      const errMsg = err.response?.data?.message || "Failed to submit. Please try again later.";
      showErrorToast(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClass="enter_warz_modal_wrapper" overlayClass="enter_warz_modal_wrapper_overlay">
      <div className="enter_warz_modal">
        {/* Header */}
        <div className="ewm_header">
          <h2 className="ewm_title">Enter the Warz</h2>
          <p className="ewm_subtitle">
            Submit your profile and showcase your amazing nail art!
          </p>
          <button className="ewm_close_btn" onClick={onClose} aria-label="Close modal">
            <IoClose />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="ewm_form_group">
            <label className="ewm_label">Full Name <span>*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
              className="ewm_input"
              disabled={submitting}
            />
            {errors.name && <span className="ewm_error_text">{errors.name}</span>}
          </div>

          {/* Email & Phone (Grid) */}
          <div className="row g-3">
            <div className="col-md-6 ewm_form_group">
              <label className="ewm_label">Email Address <span>*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="e.g. john@example.com"
                className="ewm_input"
                disabled={submitting}
              />
              {errors.email && <span className="ewm_error_text">{errors.email}</span>}
            </div>

            <div className="col-md-6 ewm_form_group">
              <label className="ewm_label">Phone Number <span>*</span></label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="e.g. +1 (555) 000-0000"
                className="ewm_input"
                disabled={submitting}
              />
              {errors.phone && <span className="ewm_error_text">{errors.phone}</span>}
            </div>
          </div>

          {/* Address */}
          <div className="ewm_form_group">
            <label className="ewm_label">Address / Location <span>*</span></label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="e.g. Los Angeles, CA"
              className="ewm_input"
              disabled={submitting}
            />
            {errors.address && <span className="ewm_error_text">{errors.address}</span>}
          </div>
          <div className="row g-3">
            <div className="col-md-6 ewm_form_group">
              <label className="ewm_label">
                Nail Technician Name <span>*</span>
              </label>

              <input
                type="text"
                name="nailTechnicianName"
                value={form.nailTechnicianName}
                onChange={handleInputChange}
                placeholder="e.g. Crystal Nails"
                className="ewm_input"
                disabled={submitting}
              />

              {errors.nailTechnicianName && (
                <span className="ewm_error_text">
                  {errors.nailTechnicianName}
                </span>
              )}
            </div>

            <div className="col-md-6 ewm_form_group">
              <label className="ewm_label">
                Salon Name <span>*</span>
              </label>

              <input
                type="text"
                name="salonName"
                value={form.salonName}
                onChange={handleInputChange}
                placeholder="e.g. Luxury Nail Studio"
                className="ewm_input"
                disabled={submitting}
              />

              {errors.salonName && (
                <span className="ewm_error_text">
                  {errors.salonName}
                </span>
              )}
            </div>
          </div>
          {/* Social Platform & Handle */}
          <div className="ewm_form_group">
            <label className="ewm_label">Social Media Handle <span>*</span></label>
            <div className="ewm_social_group">
              <select
                name="socialPlatform"
                value={form.socialPlatform}
                onChange={handleInputChange}
                className="ewm_select"
                disabled={submitting}
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">X (Twitter)</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="socialHandle"
                value={form.socialHandle}
                onChange={handleInputChange}
                placeholder="e.g. @example_art"
                className="ewm_input"
                disabled={submitting}
              />
            </div>
            {errors.socialHandle && <span className="ewm_error_text">{errors.socialHandle}</span>}
          </div>

          {/* Description */}
          <div className="ewm_form_group">
            <label className="ewm_label">Description / Bio <span>*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Tell us about yourself and your unique nail art style..."
              className="ewm_textarea"
              disabled={submitting}
            />
            {errors.description && <span className="ewm_error_text">{errors.description}</span>}
          </div>

          {/* Images Upload */}
          <div className="ewm_form_group">
            <label className="ewm_label">Art Work Images (Max 5) <span>*</span></label>
            <label className="ewm_upload_zone">
              <BsUpload className="ewm_upload_icon" />
              <span className="ewm_upload_text">Click to upload your artwork</span>
              <span className="ewm_upload_hint">Supports PNG, JPG, JPEG (Up to 5 images)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                hidden
                disabled={submitting}
              />
            </label>
            {errors.images && <span className="ewm_error_text">{errors.images}</span>}

            {/* Images Previews */}
            {form.images.length > 0 && (
              <div className="ewm_preview_grid">
                {form.images.map((image, index) => {
                  const imageUrl = URL.createObjectURL(image);
                  return (
                    <div key={index} className="ewm_image_thumb">
                      <img src={imageUrl} alt={`Artwork upload preview ${index + 1}`} />
                      <button
                        type="button"
                        className="ewm_delete_thumb_btn"
                        onClick={() => removeImage(index)}
                        disabled={submitting}
                        title="Remove image"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="ewm_footer">
            <button
              type="button"
              className="ewm_btn_cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ewm_btn_submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="ewm_spinner" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Entry"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
