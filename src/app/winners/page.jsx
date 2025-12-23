import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import BattleFinalScoreboard from "@/components/winners/BattleFinalScoreboard";

export default function BattlesPage() {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="The Winners" bannerPara="Vote for your favorite nail art designs and watch the battles unfold!" />
            <div className="container my-5">
                <BattleFinalScoreboard />
            </div>
            <AppCTASection />
            <Footer />
        </>

    );
}
