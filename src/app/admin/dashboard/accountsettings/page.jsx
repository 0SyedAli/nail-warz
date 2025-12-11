"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaRegEdit, FaTimes } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import Select from "react-select";
import MultiSelect from "@/components/MultiSelect";
const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const EditProfile = () => {
    const router = useRouter();
    const [adminId, setAdminId] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [existingData, setExistingData] = useState(null);
    const [hasCommonTimes, setHasCommonTimes] = useState(true);
    const [vendorCategory, setVendorCategory] = useState([]);
    const [vendorInput, setVendorInput] = useState("");

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            workingDays: [],
            startTime: "",
            endTime: "",
            images: [],
            category: [],
            salonName: "",
            phoneNumber: "",
            bussinessAddress: "",
            locationName: "",
            description: ""
        },
    });

    const images = watch("images");
    const [previews, setPreviews] = useState([]);

    // Handle image previews
    useEffect(() => {
        const currentImages = images || [];
        const newPreviews = currentImages
            .filter(img => img instanceof File)
            .map((f) => URL.createObjectURL(f));

        setPreviews(newPreviews);

        return () => {
            newPreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    // Fetch admin data and categories
    useEffect(() => {
        const fetchData = async () => {
            const cookie = Cookies.get("user");
            if (!cookie) {
                router.push("/auth/login");
                return;
            }

            try {
                const user = JSON.parse(cookie);
                if (!user?._id) {
                    router.push("/auth/login");
                    return;
                }

                setAdminId(user._id);

                // Fetch admin profile data
                const [profileRes, categoriesRes] = await Promise.all([
                    api.get(`/getAdminById?salonId=${user._id}`),
                    api.get("/getAllCategories")
                ]);

                if (profileRes.data?.success) {
                    const profileData = profileRes.data.data;
                    setExistingData(profileData);

                    // Check if all working days have the same times
                    const firstDay = profileData.workingDays?.[0];
                    const allSameTimes = profileData.workingDays?.every(day =>
                        day.startTime === firstDay?.startTime &&
                        day.endTime === firstDay?.endTime
                    );
                    setHasCommonTimes(allSameTimes);
                    const workingDaysObj = {};

                    DAYS_OF_WEEK.forEach(day => {
                        const found = profileData.workingDays?.find(d => d.day === day);
                        workingDaysObj[day] = {
                            isActive: found?.isActive || false,
                            startTime: found?.startTime || "",
                            endTime: found?.endTime || "",
                        };
                    });
                    // Set form values
                    reset({
                        salonName: profileData.salonName || "",
                        phoneNumber: profileData.phoneNumber?.toString() || "",
                        bussinessAddress: profileData.bussinessAddress || "",
                        locationName: profileData.locationName || "",
                        description: profileData.description || "",
                        // workingDays: profileData.workingDays?.map(d => d.day) || [],
                        workingDays: workingDaysObj,   // <-- set here
                        startTime: allSameTimes ? firstDay?.startTime : "",
                        endTime: allSameTimes ? firstDay?.endTime : "",
                        category: profileData.categoryId?.map(c => ({
                            value: c._id,
                            label: c.categoryName
                        })) || [],
                        images: []
                    });

                    // Set existing image if available
                    if (profileData.image?.[0]) {
                        setPreviews([`${process.env.NEXT_PUBLIC_IMAGE_URL}/${profileData.image[0]}`]);
                        // console.log(`${process.env.NEXT_PUBLIC_IMAGE_URL}/${profileData.image[0]}`);
                    }
                }

                if (categoriesRes.data?.success) {
                    setCategoryList(categoriesRes.data.data || []);
                }
            } catch (error) {
                showErrorToast("Failed to fetch data");
            }
        };

        fetchData();
    }, [router, reset]);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);
    // const onSubmit = async (data) => {
    //     setIsLoading(true);
    //     try {
    //         const formData = new FormData();
    //         formData.append("id", adminId);
    //         formData.append("salonName", data.salonName);
    //         formData.append("phoneNumber", data.phoneNumber);
    //         formData.append("bussinessAddress", data.bussinessAddress);
    //         formData.append("description", data.description);
    //         formData.append("locationName", data.locationName);
    //         formData.append("latitude", existingData?.latitude?.toString() || "37.0802");
    //         formData.append("longitude", existingData?.longitude?.toString() || "95.7029");

    //         // Working days payload
    //         // const days = data.workingDays.map((day) => ({
    //         //     day,
    //         //     isActive: true,
    //         //     startTime: data.startTime,
    //         //     endTime: data.endTime,
    //         // }));
    //         // Build workingDays payload correctly
    //         const daysPayload = DAYS_OF_WEEK.map(day => {
    //             const item = data.workingDays?.[day] || {};
    //             return {
    //                 day,
    //                 isActive: !!item.isActive,
    //                 startTime: item.startTime || "",
    //                 endTime: item.endTime || ""
    //             };
    //         });
    //         formData.append("workingDays", JSON.stringify(daysPayload));
    //         // formData.append("workingDays", JSON.stringify(days));

    //         // Category IDs
    //         // formData.append("categoryId", JSON.stringify([data.category]));
    //         formData.append(
    //             "categoryId",
    //             JSON.stringify(data.category.map(c => c.value))
    //         );
    //         // Append new images
    //         data.images.forEach((file) => formData.append("image", file));

    //         const res = await api.post("/updateAdminProfile", formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         });

    //         if (res.data.success) {
    //             showSuccessToast("Profile updated successfully!");
    //             router.refresh();
    //         } else {
    //             throw new Error(res.data.message || "Profile update failed");
    //         }
    //     } catch (error) {
    //         showErrorToast(error.message || "Failed to update profile");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();

            formData.append("id", adminId);

            // only send salonName if changed
            if (data.salonName !== existingData.salonName) {
                formData.append("salonName", data.salonName);
            }

            if (data.phoneNumber !== existingData.phoneNumber?.toString()) {
                formData.append("phoneNumber", data.phoneNumber);
            }

            if (data.bussinessAddress !== existingData.bussinessAddress) {
                formData.append("bussinessAddress", data.bussinessAddress);
            }

            if (data.description !== existingData.description) {
                formData.append("description", data.description);
            }

            if (data.locationName !== existingData.locationName) {
                formData.append("locationName", data.locationName);
            }

            // category changed?
            const oldCats = existingData.categoryId.map(c => c._id);
            const newCats = data.category.map(c => c.value);

            if (JSON.stringify(oldCats) !== JSON.stringify(newCats)) {
                formData.append("categoryId", JSON.stringify(newCats));
            }
            if (vendorCategory.length > 0) {
                formData.append("vendorCategory", JSON.stringify(vendorCategory));
            }
            // working days changed?
            const oldWD = JSON.stringify(existingData.workingDays);
            const newWD = JSON.stringify(DAYS_OF_WEEK.map(day => ({
                day,
                isActive: data.workingDays[day].isActive,
                startTime: data.workingDays[day].startTime,
                endTime: data.workingDays[day].endTime
            })));
            if (oldWD !== newWD) {
                formData.append("workingDays", newWD);
            }

            // new image(s)
            if (data.images.length > 0) {
                data.images.forEach(f => formData.append("image", f));
            }

            const res = await api.post("/updateAdminProfile", formData);
            if (res.data.success) {
                showSuccessToast("Updated!");
                router.refresh();
            }

        } catch (e) {
            showErrorToast("Error Updating");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            // Clear any existing preview URLs
            previews.forEach(url => URL.revokeObjectURL(url));

            // Create new previews (replaces all existing images)
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);

            // Clear existing images from state
            setExistingData(prev => ({ ...prev, image: [] }));

            // Update form values with new files only
            setValue("images", files, { shouldValidate: true });
        }
        e.target.value = "";
    };

    const removeImage = (index) => {
        // Remove from form data
        const updatedImages = [...watch("images")];
        updatedImages.splice(index, 1);
        setValue("images", updatedImages, { shouldValidate: true });

        // Remove from previews and revoke URL
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const toggleWorkingDay = (day) => {
        const currentDays = watch("workingDays") || [];
        if (currentDays.includes(day)) {
            setValue("workingDays", currentDays.filter(d => d !== day), { shouldValidate: true });
        } else {
            setValue("workingDays", [...currentDays, day], { shouldValidate: true });
        }
    };
    const handleAddVendorCategory = () => {
        const trimmed = vendorInput.trim();
        if (trimmed && !vendorCategory.includes(trimmed)) {
            setVendorCategory([...vendorCategory, trimmed]);
            setVendorInput("");
        }
    };

    const handleRemoveVendorCategory = (index) => {
        setVendorCategory(vendorCategory.filter((_, i) => i !== index));
    };
    return (
        <div className="w-100">
            <div className="m_tabs_main mt-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="ast_main">
                        <h3 className="mb-4">Update Salon Account Settings</h3>

                        {/* Services Images */}
                        <div className="ast_item">
                            <div className="ast_file px-2" style={{ width: "fit-content" }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    id="profileImage"
                                />
                                <label htmlFor="profileImage" style={{ cursor: "pointer" }}>
                                    <h5>Update Profile Image</h5>
                                    <span><FaRegEdit /></span>
                                </label>
                            </div>
                        </div>

                        {/* Image Previews - Shows either existing OR new images */}
                        {(existingData?.image?.length > 0 || previews.length > 0) && (
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                {/* Show existing images ONLY if no new previews exist */}
                                {!previews.length && existingData?.image?.map((img, index) => (
                                    <div key={`existing-${index}`} style={{ position: "relative" }}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`}
                                            width={80}
                                            height={80}
                                            style={{ height: "80px", width: "80px" }}
                                            alt={`Salon Image ${index + 1}`}
                                            className="rounded border object-fit-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setExistingData(prev => ({
                                                    ...prev,
                                                    image: prev.image.filter((_, i) => i !== index)
                                                }));
                                            }}
                                            className="btn btn-sm btn-danger"
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                padding: "0.1rem 0.3rem",
                                            }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}

                                {/* Show newly uploaded images (replaces existing ones) */}
                                {previews.map((src, index) => (
                                    <div key={`new-${index}`} style={{ position: "relative" }}>
                                        <Image
                                            src={src}
                                            width={80}
                                            height={80}
                                            style={{ height: "80px", width: "80px" }}
                                            alt={`New Image ${index + 1}`}
                                            className="rounded border object-fit-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="btn btn-sm btn-danger"
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                padding: "0.1rem 0.3rem",
                                            }}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="row pt-3 gx-3 gy-3">
                            {/* Salon Name */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Salon Name</label>
                                    <input
                                        type="text"
                                        {...register("salonName")}
                                        className={`form-control ${errors.salonName ? "is-invalid" : ""}`}
                                    />
                                    {errors.salonName && (
                                        <div className="invalid-feedback">{errors.salonName.message}</div>
                                    )}
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        {...register("phoneNumber")}
                                        className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                                    />
                                    {errors.phoneNumber && (
                                        <div className="invalid-feedback">{errors.phoneNumber.message}</div>
                                    )}
                                </div>
                            </div>

                            {/* Business Address */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Business Address</label>
                                    <input
                                        type="text"
                                        {...register("bussinessAddress")}
                                        className={`form-control ${errors.bussinessAddress ? "is-invalid" : ""}`}
                                    />
                                    {errors.bussinessAddress && (
                                        <div className="invalid-feedback">{errors.bussinessAddress.message}</div>
                                    )}
                                </div>
                            </div>

                            {/* Location  */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        {...register("locationName")}
                                        className={`form-control ${errors.locationName ? "is-invalid" : ""}`}
                                    />
                                    {errors.locationName && (
                                        <div className="invalid-feedback">{errors.locationName.message}</div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Business Bio</label>
                                    <input
                                        type="text"
                                        {...register("description")}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            {/* Category */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Category</label>
                                    {isClient && (
                                        <MultiSelect
                                            options={categoryList.map(c => ({ value: c._id, label: c.categoryName }))}
                                            value={watch("category")}
                                            onChange={(val) => setValue("category", val, { shouldValidate: true })}
                                            placeholder="Select Category"
                                        />
                                    )}
                                    {errors.category && (
                                        <div className="invalid-feedback">{errors.category.message}</div>
                                    )}
                                </div>
                            </div>
                            {/* Vendor Category */}
                            {/* <div className="col-md-4">
                                <div className="am_field">
                                    <label>Vendor Category</label>
                                    <div className="d-flex align-items-center gap-2">
                                        <input
                                            type="text"
                                            value={vendorInput}
                                            onChange={(e) => setVendorInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddVendorCategory();
                                                }
                                            }}
                                            placeholder="Type and press Enter"
                                            className="form-control"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddVendorCategory}
                                            className="btn btn-success"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {vendorCategory.map((cat, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-primary d-flex align-items-center justify-content-center vc-badge"
                                                style={{
                                                    borderRadius: "5px",
                                                    padding: "6px 10px",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                {cat}
                                                <FaTimes
                                                    style={{
                                                        marginLeft: "8px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleRemoveVendorCategory(index)}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div> */}

                            <div className="col-8 wd_table">
                                <label className="mb-2" style={{ fontSize: "13px", fontWeight: 700, color: "#606060" }}>Working days & timing</label>

                                <div className="table-responsive">
                                    <table className="table table-bordered ">
                                        <thead>
                                            <tr>
                                                <th>Day</th>
                                                <th>Active</th>
                                                <th style={{ width: 120 }}>Start</th>
                                                <th style={{ width: 120 }}>End</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {DAYS_OF_WEEK.map((day) => {
                                                const wd = watch(`workingDays.${day}`) || {};
                                                return (
                                                    <tr key={day}>
                                                        <td>{day}</td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                {...register(`workingDays.${day}.isActive`)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="time"
                                                                className="form-control"
                                                                {...register(`workingDays.${day}.startTime`)}
                                                                disabled={!wd.isActive}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="time"
                                                                className="form-control"
                                                                {...register(`workingDays.${day}.endTime`)}
                                                                disabled={!wd.isActive}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>




                            {/* Submit Button */}
                            <div className="col-12">
                                <div className="am_btn">
                                    <button
                                        className="btn themebtn4 green"
                                        type="submit"
                                        disabled={isSubmitting || isLoading}
                                    >
                                        {isSubmitting || isLoading ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;