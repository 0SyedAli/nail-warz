"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@chakra-ui/react";
import BattleModal from "@/components/Modal/BattleModal";
import BattleCard from "@/components/battles/BattleCard";
import BattleStats from "@/components/battles/BattleStats";

export default function BattleManagementPage() {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [battles, setBattles] = useState([]);
    const [editBattle, setEditBattle] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔐 AUTH
    useEffect(() => {
        if (!Cookies.get("token")) router.push("/admin/auth/login");
    }, []);

    const fetchBattles = async () => {
        setLoading(true);
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/battle`,
            {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            }
        );
        const json = await res.json();
        if (json.success) setBattles(json.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBattles();
    }, []);

    const active = battles.filter(b => b.status === "active");
    const upcoming = battles.filter(b => b.status === "upcoming");
    const completed = battles.filter(b => b.status === "completed");

    return (
        <div className="page">
            <div className="dashboard_panel_inner pt-4">

                {/* ===== HEADER ===== */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-bold">Warz Management</h4>
                        <p className="text-muted">Create and manage nail art battles</p>
                    </div>
                    <button
                        className="btn btn-dark"
                        onClick={() => {
                            setEditBattle(null);
                            onOpen();
                        }}
                    >
                        + Create New Battle
                    </button>
                </div>

                {/* ===== STATS ===== */}
                <BattleStats battles={battles} />

                {/* ===== BATTLE SECTIONS ===== */}
                <div className="row g-4 mt-2">
                    {active.length > 0 &&
                        <BattleCard
                            title="Active Battles"
                            battles={active}
                            onEdit={(b) => {
                                setEditBattle(b);
                                onOpen();
                            }}
                        />
                    }
                    {upcoming.length > 0 &&
                        <BattleCard
                            title="Upcoming Battles"
                            battles={upcoming}
                            onEdit={(b) => {
                                setEditBattle(b);
                                onOpen();
                            }}
                        />
                    }
                    {completed.length > 0 &&
                        <BattleCard
                            title="Completed Battles"
                            battles={completed}
                            completed
                        />
                    }

                </div>
            </div>

            {/* ===== CREATE / EDIT MODAL ===== */}
            <BattleModal
                isOpen={isOpen}
                onClose={onClose}
                battle={editBattle}
                onSuccess={fetchBattles}
            />
        </div>
    );
}
