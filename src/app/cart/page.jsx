"use client"
import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import RelatedProducts from "@/components/product/RelatedProducts";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { openLoginModal } from "@/redux/slice/uiSlice";

export default function AddToCart() {
    const items = useSelector(state => state.cart.items);
    console.log(items);
    const router = useRouter()
    const dispatch = useDispatch();

    useEffect(() => {
        if (items.length === 0) {
            router.push("/store")
        }
    }, [items])

    const handleCheckout = (e) => {
        e.preventDefault();
        router.push("/checkout");
    };
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
                                {items.map(item => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                    />
                                ))}

                            </div>
                        </div>

                        {/* Right: Summary */}
                        <div className="col-lg-4">
                            <OrderSummary />
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-4 d-flex align-items-center gap-3">
                        <Link href="/store" className="btn w-100 checkout-btn-outline">
                            Back To Store
                        </Link>
                        <button onClick={handleCheckout} className="btn w-100 checkout-btn">
                            Continue to Checkout
                        </button>
                    </div>
                    <RelatedProducts />
                </div>
            </div>
            <AppCTASection />
            <Footer />
        </>
    );
}
