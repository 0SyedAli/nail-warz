import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";

export default function ProductPage() {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Product Details" bannerPara="Premium nail care products and professional tools" />
            <div className="product-page">
                <div className="row">
                    <div className="col-6">
                        <ImageGallery />
                    </div>
                    <div className="col-6">
                        <ProductInfo />
                    </div>
                </div>

                <ProductTabs />
                <RelatedProducts />
            </div>
            <AppCTASection />
            <Footer />
        </>
    );
}
