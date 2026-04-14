"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaExclamationCircle, FaRegEdit, FaTimes } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "src/lib/toast";
import { PatternFormat } from "react-number-format";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
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
    const popoverRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [adminId, setAdminId] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [existingData, setExistingData] = useState(null);
    const [hasCommonTimes, setHasCommonTimes] = useState(true);
    const [vendorCategory, setVendorCategory] = useState([]);
    const [vendorInput, setVendorInput] = useState("");
    const [cityAutocomplete, setCityAutocomplete] = useState(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

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
            name: "",
            phoneNumber: "",
            // bussinessAddress: "",
            // locationName: "",
            city: "",
            state: "",
            zipCode: "",
            street: "",
            description: "",
            bussinessPhoneNumber: "",
            bussinessWebsite: "",
            bussinessEmail: "",
        },
    });

    const images = watch("images");
    const [previews, setPreviews] = useState([]);

    const handleCitySelect = () => {
        if (!cityAutocomplete) return;

        const place = cityAutocomplete.getPlace();
        if (!place || !place.address_components) return;

        let city = "";
        let state = "";
        let zip = "";

        place.address_components.forEach((component) => {
            if (component.types.includes("locality")) {
                city = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
            }
            if (component.types.includes("postal_code")) {
                zip = component.long_name;
            }
        });

        setValue("city", city, { shouldValidate: true });
        setValue("state", state, { shouldValidate: true });
        setValue("zipCode", zip, { shouldValidate: true });


    };

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
                        name: profileData.name || "",
                        salonName: profileData.salonName || "",
                        phoneNumber: profileData.phoneNumber?.toString() || "",
                        // bussinessAddress: profileData.bussinessAddress || "",
                        // locationName: profileData.locationName || "",
                        city: profileData.city || "",
                        locationName: profileData.city || "",
                        state: profileData.state || "",
                        zipCode: profileData.zipCode || "",
                        street: profileData.street || "",
                        description: profileData.description || "",
                        bussinessPhoneNumber: profileData.bussinessPhoneNumber || "",
                        bussinessWebsite: profileData.bussinessWebsite || "",
                        bussinessEmail: profileData.bussinessEmail || "",
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

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();

            formData.append("id", adminId);

            // only send salonName if changed
            if (data.name !== existingData.name) {
                formData.append("name", data.name);
            }
            if (data.salonName !== existingData.salonName) {
                formData.append("salonName", data.salonName);
            }

            // if (data.phoneNumber !== existingData.phoneNumber?.toString()) {
            //     formData.append("phoneNumber", data.phoneNumber);
            // }
            const cleanPhone = data.phoneNumber?.replace(/\D/g, "") || "";

            if (cleanPhone !== existingData.phoneNumber?.toString()) {
                formData.append("phoneNumber", cleanPhone);
            }

            if (data.description !== existingData.description) {
                formData.append("description", data.description);
            }

            // if (data.bussinessAddress !== existingData.bussinessAddress) {
            //     formData.append("bussinessAddress", data.bussinessAddress);
            // }

            // if (data.locationName !== existingData.locationName) {
            //     formData.append("locationName", data.locationName);
            // }
            if (data.street !== existingData.street) {
                formData.append("street", data.street);
            }
            if (data.city !== existingData.city) {
                formData.append("city", data.city);
            }
            if (data.locationName !== existingData.locationName) {
                formData.append("locationName", data.city);
            }

            if (data.state !== existingData.state) {
                formData.append("state", data.state);
            }

            if (data.zipCode !== existingData.zipCode) {
                formData.append("zipCode", data.zipCode);
            }

            if (data.bussinessPhoneNumber !== existingData.bussinessPhoneNumber) {
                formData.append("bussinessPhoneNumber", data.bussinessPhoneNumber);
            }
            if (data.bussinessWebsite !== existingData.bussinessWebsite) {
                formData.append("bussinessWebsite", data.bussinessWebsite);
            }

            if (data.bussinessEmail !== existingData.bussinessEmail) {
                formData.append("bussinessEmail", data.bussinessEmail);
            }

            // category changed?
            // const oldCats = existingData.categoryId.map(c => c._id);
            const oldCats = existingData.categoryId?.map(c => c._id) || [];

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
                                    <label>Owner Name</label>
                                    <input
                                        type="text"
                                        {...register("name")}
                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback">{errors.name.message}</div>
                                    )}
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Owner Phone Number</label>
                                    {/* <input
                                        type="text"
                                        {...register("phoneNumber")}
                                        className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                                    /> */}

                                    <PatternFormat
                                        format="+1 (###) ###-####"
                                        mask="_"
                                        value={watch("phoneNumber") || ""}
                                        onValueChange={(values) => {
                                            setValue("phoneNumber", values.formattedValue, {
                                                shouldValidate: true,
                                            });
                                        }}
                                        customInput="input"
                                        className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                                        placeholder="+1 (123) 456-7890"
                                    />

                                    {errors.phoneNumber && (
                                        <div className="invalid-feedback">{errors.phoneNumber.message}</div>
                                    )}
                                </div>
                            </div>

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
                            {/* Business Address */}
                            {/* <div className="col-md-4">
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
                            </div> */}

                            {/* Location  */}
                            {/* <div className="col-md-4">
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
                            </div> */}
                            {/* Street Address */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Street Address</label>
                                    <input
                                        type="text"
                                        {...register("street")}
                                        className={`form-control ${errors.street ? "is-invalid" : ""}`}
                                    />
                                    {errors.street && (
                                        <div className="invalid-feedback">{errors.street.message}</div>
                                    )}
                                </div>
                            </div>
                            {/* City */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>City</label>

                                    {isLoaded ? (
                                        <Autocomplete
                                            onLoad={(auto) => setCityAutocomplete(auto)}
                                            onPlaceChanged={handleCitySelect}
                                            options={{ types: ["(cities)"] }}
                                        >
                                            <input
                                                type="text"
                                                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                                value={watch("city") || ""}
                                                onChange={(e) =>
                                                    setValue("city", e.target.value, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                placeholder="Start typing city..."
                                            />
                                        </Autocomplete>
                                    ) : (
                                        <input
                                            type="text"
                                            {...register("city")}
                                            className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                        />
                                    )}

                                    {errors.city && (
                                        <div className="invalid-feedback">
                                            {errors.city.message}
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* State */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        {...register("state")}
                                        className={`form-control ${errors.state ? "is-invalid" : ""}`}
                                    />
                                    {errors.state && (
                                        <div className="invalid-feedback">{errors.state.message}</div>
                                    )}
                                </div>
                            </div>

                            {/* Zip Code */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Zip Code</label>
                                    <input
                                        type="text"
                                        {...register("zipCode")}
                                        className={`form-control ${errors.zipCode ? "is-invalid" : ""}`}
                                    />
                                    {errors.zipCode && (
                                        <div className="invalid-feedback">{errors.zipCode.message}</div>
                                    )}
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Salon Phone Number</label>
                                    {/* <input
                                        type="text"
                                        {...register("phoneNumber")}
                                        className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                                    /> */}

                                    <PatternFormat
                                        format="+1 (###) ###-####"
                                        mask="_"
                                        value={watch("bussinessPhoneNumber") || ""}
                                        onValueChange={(values) => {
                                            setValue("bussinessPhoneNumber", values.formattedValue, {
                                                shouldValidate: true,
                                            });
                                        }}
                                        customInput="input"
                                        className={`form-control ${errors.bussinessPhoneNumber ? "is-invalid" : ""}`}
                                        placeholder="+1 (123) 456-7890"
                                    />

                                    {errors.bussinessPhoneNumber && (
                                        <div className="invalid-feedback">{errors.bussinessPhoneNumber.message}</div>
                                    )}
                                </div>
                            </div>

                            {/* Business Email */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Salon Email</label>
                                    <input
                                        type="text"
                                        {...register("bussinessEmail")}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            {/* Business Bio */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Salon Website</label>
                                    <input
                                        type="text"
                                        {...register("bussinessWebsite")}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            {/* Business Bio */}
                            <div className="col-md-4">
                                <div className="am_field">
                                    <label>Salon Bio</label>
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
                                    {/* <label className="d-flex align-items-center gap-1">Filter <FaExclamationCircle  color="#000"/></label> */}
                                    <div className="position-relative w-100 d-inline-flex align-items-center gap-1">
                                        <label className="d-flex align-items-center gap-1 mb-0">
                                            Service Filters
                                            <FaExclamationCircle
                                                color="#000"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setOpen(!open)}
                                            />
                                        </label>

                                        {open && (
                                            <div ref={popoverRef} className="filter-popover fw-bold">
                                                Service Filters help customers find your business when searching
                                                for specific services in the Nail Warz app. Select all filters that
                                                accurately reflect the services you offer. These filters are
                                                managed by Nail Warz to ensure consistent search results across
                                                the platform.
                                                <br /> <br />
                                                Tip: Choosing all relevant filters improves your visibility and helps
                                                nearby customers discover your services more easily.
                                            </div>
                                        )}
                                    </div>
                                    {isClient && (
                                        <MultiSelect
                                            options={categoryList.map(c => ({ value: c._id, label: c.categoryName }))}
                                            value={watch("category")}
                                            onChange={(val) => setValue("category", val, { shouldValidate: true })}
                                            placeholder="Select Filter"
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

                            <div className="col-md-8 wd_table">
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