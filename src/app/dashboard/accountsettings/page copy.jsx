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

export default function EditProfile() {

    const router = useRouter();
    const popoverRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [adminId, setAdminId] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [existingData, setExistingData] = useState(null);
    const [previews, setPreviews] = useState([]);

    const [cityAutocomplete, setCityAutocomplete] = useState(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            workingDays: {},
            images: [],
            category: []
        }
    });

    const images = watch("images");

    useEffect(() => {
        const newPreviews = (images || [])
            .filter(img => img instanceof File)
            .map(file => URL.createObjectURL(file));

        setPreviews(newPreviews);

        return () => newPreviews.forEach(URL.revokeObjectURL);
    }, [images]);


    useEffect(() => {

        const fetchData = async () => {

            const cookie = Cookies.get("user");
            if (!cookie) {
                router.push("/auth/login");
                return;
            }

            try {

                const user = JSON.parse(cookie);
                setAdminId(user._id);

                const [profileRes, categoriesRes] = await Promise.all([
                    api.get(`/getAdminById?salonId=${user._id}`),
                    api.get("/getAllCategories")
                ]);

                if (profileRes.data?.success) {

                    const data = profileRes.data.data;
                    setExistingData(data);

                    const workingDaysObj = {};

                    DAYS_OF_WEEK.forEach(day => {
                        const found = data.workingDays?.find(d => d.day === day);

                        workingDaysObj[day] = {
                            isActive: found?.isActive || false,
                            startTime: found?.startTime || "",
                            endTime: found?.endTime || ""
                        };
                    });

                    reset({
                        salonName: data.salonName || "",
                        phoneNumber: data.phoneNumber?.toString() || "",
                        streetAddress: data.streetAddress || "",
                        city: data.city || "",
                        state: data.state || "",
                        zipCode: data.zipCode || "",
                        description: data.description || "",
                        bussinessPhoneNumber: data.bussinessPhoneNumber || "",
                        bussinessWebsite: data.bussinessWebsite || "",
                        bussinessEmail: data.bussinessEmail || "",
                        workingDays: workingDaysObj,
                        category: data.categoryId?.map(c => ({
                            value: c._id,
                            label: c.categoryName
                        })) || [],
                        images: []
                    });

                    if (data.image?.[0]) {
                        setPreviews([
                            `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.image[0]}`
                        ]);
                    }

                }

                if (categoriesRes.data?.success) {
                    setCategoryList(categoriesRes.data.data || []);
                }

            }
            catch {
                showErrorToast("Failed to fetch data");
            }

        };

        fetchData();

    }, [router, reset]);



    const handleCitySelect = () => {
        if (!cityAutocomplete) return;

        const place = cityAutocomplete.getPlace();

        let city = "", state = "", zip = "";

        place.address_components?.forEach(c => {

            if (c.types.includes("locality")) city = c.long_name;
            if (c.types.includes("administrative_area_level_1")) state = c.long_name;
            if (c.types.includes("postal_code")) zip = c.long_name;

        });

        setValue("city", city);
        setValue("state", state);
        setValue("zipCode", zip);

    };



    const handleImageChange = (e) => {

        const files = Array.from(e.target.files || []);

        setValue("images", files);

        setPreviews(files.map(f => URL.createObjectURL(f)));

    };



    const onSubmit = async (data) => {

        setIsLoading(true);

        try {

            const formData = new FormData();

            formData.append("id", adminId);

            formData.append("salonName", data.salonName);

            const phone = data.phoneNumber?.replace(/\D/g, "") || "";
            formData.append("phoneNumber", phone);

            formData.append("streetAddress", data.streetAddress);
            formData.append("city", data.city);
            formData.append("state", data.state);
            formData.append("zipCode", data.zipCode);

            formData.append("bussinessPhoneNumber", data.bussinessPhoneNumber);
            formData.append("bussinessWebsite", data.bussinessWebsite);
            formData.append("bussinessEmail", data.bussinessEmail);

            formData.append("description", data.description);

            formData.append("categoryId", JSON.stringify(
                data.category.map(c => c.value)
            ));

            formData.append("workingDays", JSON.stringify(
                DAYS_OF_WEEK.map(day => ({
                    day,
                    ...data.workingDays[day]
                }))
            ));

            if (data.images.length) {
                data.images.forEach(f => formData.append("image", f));
            }

            const res = await api.post("/updateAdminProfile", formData);

            if (res.data.success) {
                showSuccessToast("Updated!");
                router.refresh();
            }

        }
        catch {
            showErrorToast("Update Failed");
        }
        finally {
            setIsLoading(false);
        }

    };



    return (

        <div className="w-100">

            <div className="m_tabs_main mt-5">

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="ast_main">

                        <h3 className="mb-4">Update Salon Account Settings</h3>

                        {/* OWNER INFO */}

                        <div className="card p-4 mb-4">

                            <h5 className="mb-3 fw-bold">Owner Information</h5>

                            <div className="row gy-3">

                                <div className="col-md-4">
                                    <label>Owner Name</label>
                                    <input
                                        type="text"
                                        {...register("salonName")}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label>Owner Phone</label>

                                    <PatternFormat
                                        format="+1 (###) ###-####"
                                        mask="_"
                                        value={watch("phoneNumber") || ""}
                                        onValueChange={(v) => {
                                            setValue("phoneNumber", v.formattedValue);
                                        }}
                                        customInput="input"
                                        className="form-control"
                                    />

                                </div>

                            </div>

                        </div>



                        {/* SALON INFO */}

                        <div className="card p-4 mb-4">

                            <h5 className="mb-3 fw-bold">Salon / Vendor Information</h5>


                            {/* IMAGE */}

                            <div className="mb-3">

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />

                            </div>

                            <div className="d-flex gap-2 flex-wrap mb-4">

                                {previews.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img}
                                        width={80}
                                        height={80}
                                        alt=""
                                        className="rounded border"
                                    />
                                ))}

                            </div>



                            <div className="row gy-3">

                                <div className="col-md-4">
                                    <label>Street Address</label>
                                    <input
                                        type="text"
                                        {...register("streetAddress")}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-4">

                                    <label>City</label>

                                    {isLoaded ? (

                                        <Autocomplete
                                            onLoad={setCityAutocomplete}
                                            onPlaceChanged={handleCitySelect}
                                            options={{ types: ["(cities)"] }}
                                        >

                                            <input
                                                className="form-control"
                                                value={watch("city") || ""}
                                                onChange={(e) => setValue("city", e.target.value)}
                                            />

                                        </Autocomplete>

                                    ) : (

                                        <input
                                            className="form-control"
                                            {...register("city")}
                                        />

                                    )}

                                </div>


                                <div className="col-md-4">
                                    <label>State</label>
                                    <input
                                        className="form-control"
                                        {...register("state")}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label>Zip Code</label>
                                    <input
                                        className="form-control"
                                        {...register("zipCode")}
                                    />
                                </div>


                                <div className="col-md-4">
                                    <label>Business Phone</label>

                                    <PatternFormat
                                        format="+1 (###) ###-####"
                                        mask="_"
                                        value={watch("bussinessPhoneNumber") || ""}
                                        onValueChange={(v) => {
                                            setValue("bussinessPhoneNumber", v.formattedValue);
                                        }}
                                        customInput="input"
                                        className="form-control"
                                    />

                                </div>


                                <div className="col-md-4">
                                    <label>Business Email</label>
                                    <input
                                        className="form-control"
                                        {...register("bussinessEmail")}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label>Website</label>
                                    <input
                                        className="form-control"
                                        {...register("bussinessWebsite")}
                                    />
                                </div>


                                <div className="col-md-6">
                                    <label>Description</label>
                                    <input
                                        className="form-control"
                                        {...register("description")}
                                    />
                                </div>



                                <div className="col-md-6">

                                    <label>Service Filters</label>

                                    <MultiSelect
                                        options={categoryList.map(c => ({
                                            value: c._id,
                                            label: c.categoryName
                                        }))}

                                        value={watch("category")}

                                        onChange={(val) => setValue("category", val)}

                                        placeholder="Select Filters"
                                    />

                                </div>

                            </div>

                        </div>



                        {/* WORKING DAYS */}

                        <div className="card p-4 mb-4">

                            <h5 className="mb-3 fw-bold">Working Days & Timing</h5>

                            <table className="table table-bordered">

                                <thead>

                                    <tr>
                                        <th>Day</th>
                                        <th>Active</th>
                                        <th>Start</th>
                                        <th>End</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {DAYS_OF_WEEK.map(day => {

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



                        <div className="text-end">

                            <button
                                className="btn themebtn4 green"
                                type="submit"
                                disabled={isSubmitting || isLoading}
                            >

                                {isLoading ? "Updating..." : "Update"}

                            </button>

                        </div>


                    </div>

                </form>

            </div>

        </div>

    );

}