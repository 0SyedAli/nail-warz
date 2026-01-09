"use client";
import BattleHero from "@/components/battles/BattleHero";
import Battles from "@/components/battles/Battles";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import BattleCTA from "@/components/battles/BattleCTA";
import BattleLeaderboard from "@/components/battles/BattleLeaderboard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
export default function BattlesPage() {
    const [battles, setBattles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBattles = async () => {
            try {
                const res = await api.get("/battle?participants=false");

                const result = res.data; // ✅ FIX

                if (result.success) {
                    setBattles(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch battles", error);
            } finally {
                setLoading(false);
            }
        };


        fetchBattles();
    }, []);

    if (loading) {
        return <div className="text-center py-5">Loading battles...</div>;
    }
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Nail Warz" bannerPara="Premium nail care products and professional tools" bannerBtn={true} />
            <div className="container my-5">
                {/* <BattleHero /> */}
                <Battles
                    title="Active"
                    battles={battles.filter(b => b.status === "active")}
                />

                <Battles
                    title="Upcoming"
                    battles={battles.filter(b => b.status === "upcoming")}
                />

                <Battles
                    title="Completed"
                    battles={battles.filter(b => b.status === "completed")}
                />
                <BattleCTA />
                {/* <BattleLeaderboard /> */}
            </div>
            <AppCTASection />
            <Footer />
        </>

    );
}
