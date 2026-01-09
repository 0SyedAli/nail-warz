"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import Modal from "./layout";
import { showErrorToast, showSuccessToast } from "src/lib/toast";

function formatDateTime(value) {
    if (!value) return "";

    const date = new Date(value);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

// function parseToDatetimeLocal(value) {
//     if (!value) return "";

//     const date = new Date(value);
//     if (isNaN(date.getTime())) return "";

//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, "0");
//     const dd = String(date.getDate()).padStart(2, "0");
//     const hh = String(date.getHours()).padStart(2, "0");
//     const min = String(date.getMinutes()).padStart(2, "0");

//     return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
// }
function parseToDatetimeLocal(value) {
    if (!value) return "";

    // backend UTC ko bilkul as-is rakh kar input ke format me lao
    return value.replace("Z", "").slice(0, 16);
}




export default function BattleModal({ isOpen, onClose, battle, onSuccess }) {
    const isEdit = Boolean(battle);

    const [form, setForm] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (battle) {
            setForm({
                name: battle.name || "",
                description: battle.description || "",
                startDate: parseToDatetimeLocal(battle.startDate),
                endDate: parseToDatetimeLocal(battle.endDate),
            });
        } else {
            setForm({
                name: "",
                description: "",
                startDate: "",
                endDate: "",
            });
        }
    }, [battle, isOpen]);


    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const buildPayload = () => {
        const payload = {
            name: form.name,
            description: form.description,
        };

        if (form.startDate) payload.startDate = formatDateTime(form.startDate);
        if (form.endDate) payload.endDate = formatDateTime(form.endDate);

        return payload;
    };
    // const buildPayload = () => {
    //     const payload = {
    //         name: form.name,
    //         description: form.description,
    //     };

    //     if (form.startDate) {
    //         payload.startDate = new Date(form.startDate).toISOString();
    //     }

    //     if (form.endDate) {
    //         payload.endDate = new Date(form.endDate).toISOString();
    //     }

    //     return payload;
    // };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            showErrorToast("Battle name is required");
            return;
        }

        try {
            setLoading(true);

            const payload = buildPayload();
            const token = Cookies.get("token");

            if (isEdit) {
                await api.patch(`/battle/${battle._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showSuccessToast("Battle updated successfully");
            } else {
                await api.post(`/battle`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showSuccessToast("Battle created successfully");
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            showErrorToast(
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="product_modal_body">
                <div className="modal-header mb-4">
                    <h5>{isEdit ? "Edit Battle" : "Create New Battle"}</h5>
                    <button onClick={onClose}>×</button>
                </div>

                <input
                    name="name"
                    placeholder="Battle Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Battle description"
                    value={form.description}
                    onChange={handleChange}
                />

                <div className="grid-2">
                    <input
                        name="startDate"
                        type="datetime-local"
                        value={form.startDate}
                        onChange={handleChange}
                    />
                    <input
                        name="endDate"
                        type="datetime-local"
                        value={form.endDate}
                        onChange={handleChange}
                    />
                </div>

                <button
                    className="btn btn-dark w-100 mt-3"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : isEdit
                            ? "Update Battle"
                            : "Create Battle"}
                </button>
            </div>
        </Modal>
    );
}
