import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import RelatedProducts from "@/components/product/RelatedProducts";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "next/link";

export default function ProductPage() {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Your Cart" bannerPara="" />
            <div className="cart-body">
                <div className="container">
                    <div className="row g-4">

                        {/* Left: Cart Items */}
                        <div className="col-lg-8">
                            <div className="cart-box">
                                <CartItem
                                    price={145}
                                    size="Large"
                                    color="White"
                                />
                                <CartItem
                                    price={180}
                                    size="Medium"
                                    color="Red"
                                />
                                <CartItem
                                    price={240}
                                    size="Large"
                                    color="Blue"
                                    className2="mb-0 pb-0"
                                />
                            </div>
                        </div>

                        {/* Right: Summary */}
                        <div className="col-lg-4">
                            <OrderSummary />
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-4">
                        <Link href="/checkout" className="btn w-100 checkout-btn">
                            Go To The Checkout
                        </Link>
                    </div>
                    <RelatedProducts />
                </div>
            </div>
            <AppCTASection />
            <Footer />
        </>
    );
}
