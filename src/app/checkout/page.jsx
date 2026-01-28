// import CheckoutForm from "@/components/checkout/CheckoutForm";
// import CheckoutSummary from "@/components/checkout/CheckoutSummary";
// import AppCTASection from "@/components/Home/AppCTASection";
// import Footer from "@/components/Home/Footer";
// import Header from "@/components/Home/Header";
// import WebBanner from "@/components/Home/WebBanner";

// export default function ProductPage() {
//     return (
//         <>
//             <Header />
//             <WebBanner bannerTitle="Checkout" bannerPara="" />
//             <div className="cart-body">
//                 <div className="container checkout-page">
//                     <div className="row g-5">

//                         {/* LEFT */}
//                         <div className="col-lg-7">
//                             <CheckoutForm />
//                         </div>

//                         {/* RIGHT */}
//                         <div className="col-lg-5">
//                             <CheckoutSummary />
//                         </div>

//                     </div>
//                 </div>
//             </div>
//             <AppCTASection />
//             <Footer />
//         </>
//     );
// }
"use client"
import StripeProvider from "@/components/checkout/StripeProvider";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import Footer from "@/components/Home/Footer";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useSelector } from "react-redux";

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState(null)
    const cart = useSelector((state) => state.cart.items);
    const shipping = 15; // Shipping fee
    const amount = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const totalAmount = amount + shipping; // Total amount including shipping

    const hasCreatedIntent = useRef(false);

    const onSubmit = async () => {
        try {

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/order/createPaymentIntent`,
                {
                    amount: totalAmount,
                }
            );

            const result = res.data;

            if (!result?.clientSecret) {
                throw new Error(result?.message || "Payment intent failed");
            }
            setClientSecret(result?.clientSecret);

            showSuccessToast("Payment intent created successfully");

        } catch (err) {
            showErrorToast(err.message || "Something went wrong");
        }
    };
    useEffect(() => {
        if (!amount || amount <= 0) return;
        if (hasCreatedIntent.current) return; // 🔥 PREVENT DOUBLE CALL

        hasCreatedIntent.current = true;
        onSubmit();
    }, [amount]);

    if (!clientSecret) return <>loading</>;
    
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Checkout" />

            <StripeProvider clientSecret={clientSecret}>
                <div className="container checkout-page py-5">
                    <div className="row g-5">
                        <div className="col-lg-7">
                            <CheckoutForm clientSecret={clientSecret} />
                        </div>
                        <div className="col-lg-5">
                            <CheckoutSummary />
                        </div>
                    </div>
                </div>
            </StripeProvider>

            <Footer />
        </>
    );
}
