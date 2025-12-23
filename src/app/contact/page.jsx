import ContactForm from "@/components/contact/ContactForm";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";

export default function ContactPage() {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Contact Us" bannerPara="Premium nail care products and professional tools" />

            <div className="container" style={{ padding: "70px 0" }}>
                <ContactForm />
            </div>
            <AppCTASection />
            <Footer />
        </>
    );
}
