import VotingScores from "@/components/voting/VotingScores";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";

export default function ProductPage() {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Live Voting Scores" bannerPara="Vote for your favorite nail art designs and watch the battles unfold!" />
            <section style={{padding:"80px 0"}}>
                <div className="container">
                    <VotingScores />
                </div>
            </section>
            <AppCTASection />
            <Footer />
        </>
    );
}
