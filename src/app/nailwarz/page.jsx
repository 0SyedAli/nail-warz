import BattleHero from "@/components/battles/BattleHero";
import ActiveBattles from "@/components/battles/ActiveBattles";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import BattleCTA from "@/components/battles/BattleCTA";
import BattleLeaderboard from "@/components/battles/BattleLeaderboard";

export default function BattlesPage() {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Nail Warz" bannerPara="Premium nail care products and professional tools" />
            <div className="container my-5">
                <BattleHero />
                <ActiveBattles title="Active" />
                <ActiveBattles  title="Upcomming" />
                <BattleCTA />
                <BattleLeaderboard />
            </div>
            <AppCTASection />
            <Footer />
        </>

    );
}
