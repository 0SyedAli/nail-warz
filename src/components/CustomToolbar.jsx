"use client";

import Toolbar from "react-big-calendar/lib/Toolbar";

export default class CustomToolbar extends Toolbar {
    render() {
        const { label } = this.props;

        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    marginBottom: "10px",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                }}
            >
                {/* Left Navigation */}
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={() => this.navigate("PREV")}
                        style={btn}
                    >
                        ⬅
                    </button>

                    <button
                        onClick={() => this.navigate("NEXT")}
                        style={btn}
                    >
                        ➡
                    </button>
                </div>

                {/* Label */}
                <span style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>
                    {label}
                </span>

                {/* View Appointments */}
                <button
                    onClick={() => this.props.router.push("/appointmentlist")}
                    style={{
                        ...btn,
                        background: "#d5006d",
                    }}
                >
                    View Appointments →
                </button>
            </div>
        );
    }
}

const btn = {
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid rgba(255,0,0,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "16px",
};
