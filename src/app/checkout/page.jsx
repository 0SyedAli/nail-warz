import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";

export default function ProductPage() {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Checkout" bannerPara="" />
            <div className="cart-body">
                <div className="container checkout-page">
                    <div className="row g-5">

                        {/* LEFT */}
                        <div className="col-lg-7">
                            <CheckoutForm />
                        </div>

                        {/* RIGHT */}
                        <div className="col-lg-5">
                            <CheckoutSummary />
                        </div>

                    </div>
                </div>
            </div>
            <AppCTASection />
            <Footer />
        </>
    );
}
