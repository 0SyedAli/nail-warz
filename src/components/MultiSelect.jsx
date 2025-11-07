"use client"
import { useState, useRef, useEffect } from "react";

export default function MultiSelect({ options, value, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelect = (opt) => {
        const exist = value.find((v) => v.value === opt.value);
        if (exist) {
            onChange(value.filter((v) => v.value !== opt.value));
        } else {
            onChange([...value, opt]);
        }
    };

    return (
        <div className="ms_wrapper" ref={wrapperRef}>
            <div className="ms_control" onClick={() => setOpen((o) => !o)}>
                <input placeholder="Select category..." readOnly />

                <div className="d-flex align-items-center gap-2 mt-2">
                    {value.map((v) => (
                        <span className="ms_tag" key={v.value}>
                            {v.label}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(value.filter((x) => x.value !== v.value));
                                }}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {open && (
                <div className="ms_dropdown">
                    {options
                        .filter(o => !value.some(v => v.value === o.value))
                        .map((opt) => (
                            <div
                                className="ms_option"
                                key={opt.value}
                                onClick={() => toggleSelect(opt)}
                            >
                                {opt.label}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
