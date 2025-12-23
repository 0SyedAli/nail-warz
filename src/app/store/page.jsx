"use client";

import AppCTASection from "@/components/Home/AppCTASection";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import WebBanner from "@/components/Home/WebBanner";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

export default function Product() {
    return (
        <>
            <Header />
            <WebBanner bannerTitle="Our Store" bannerPara="Premium nail care products and professional tools" />
            <div className="container" style={{padding:"70px 0"}}>

                {/* Tabs */}
                <ul className="nav nav-pills product-tabs mb-4" role="tablist">
                    <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#all">
                            All
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#acrylic">
                            Acrylic Set
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#manicure">
                            Manicure
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#pedicure">
                            Pedicure
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#nailart">
                            Nail Art
                        </button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">

                    <div className="tab-pane fade show active" id="all">
                        <ProductsGrid />
                    </div>

                    <div className="tab-pane fade" id="acrylic">
                        <ProductsGrid />
                    </div>

                    <div className="tab-pane fade" id="manicure">
                        <ProductsGrid />
                    </div>

                    <div className="tab-pane fade" id="pedicure">
                        <ProductsGrid />
                    </div>

                    <div className="tab-pane fade" id="nailart">
                        <ProductsGrid />
                    </div>

                </div>
            </div>
            <AppCTASection />
            <Footer />
        </>
    );
}

/* Reusable grid */
function ProductsGrid() {
    return (
        <div className="row g-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="col-xl-3 col-md-4">
                    <Link href="/store/2">
                        <ProductCard
                            image="/images/prod_paint.png"
                            title="Lorem Ipsum Dollor"
                            price="20.00"
                        />
                    </Link>
                </div>
            ))}
        </div>
    );
}
