"use client"
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import BattleFinalScoreboard from "@/components/winners/BattleFinalScoreboard";
import { useRouter } from "next/navigation";

export default function BattlesPage() {
    const router = useRouter();
    return (
        <>
            <Header />
            <WebBanner bannerTitle="The Winners" bannerPara="Congratulations to our NAIL CHAMPION" />
            <div className="container my-5">
                <BattleFinalScoreboard />
                <div className="d-flex align-items-center justify-content-center">
                    <button className="btn btn_tech2 btn-outline-dark" onClick={() => router.back()}>
                        Go Back
                    </button>
                </div>
            </div>
            <AppCTASection />
            <Footer />
        </>

    );
}
