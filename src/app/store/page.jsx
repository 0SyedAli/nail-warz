"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import WebBanner from "@/components/Home/WebBanner";
import AppCTASection from "@/components/Home/AppCTASection";
import ProductCard from "@/components/product/ProductCard";
import axios from "axios";

const TABS = [
    { key: "all", label: "All" },
    { key: "Nail Art", label: "Nail Art" },
    { key: "Nail Polish", label: "Nail Polish" },
    { key: "Tools", label: "Tools" },
    { key: "Equipment", label: "Equipment" },
];

export default function Product() {
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProducts() {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/product`,
                    {
                        signal: controller.signal,
                    }
                );

                // ✅ AXIOS: data is already parsed
                const json = res.data;

                if (!json?.success || !Array.isArray(json.products)) {
                    throw new Error("Invalid API response structure");
                }

                // ✅ Filter active & non-deleted products
                const visibleProducts = json.products.filter(
                    (p) => !p.isDeleted
                );

                setProducts(visibleProducts);

            } catch (err) {
                // ✅ Axios error handling
                if (axios.isCancel(err)) return;

                const message =
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load products";

                setError(message);
            } finally {
                await new Promise(r => setTimeout(r, 600)); // dev UX
                setLoading(false);
            }
        }

        fetchProducts();
        return () => controller.abort();
    }, []);


    /* Category filter (category is ARRAY in your API) */
    const filteredProducts = useMemo(() => {
        if (activeTab === "all") return products;

        return products.filter((p) =>
            Array.isArray(p.category) && p.category.includes(activeTab)
        );
    }, [products, activeTab]);
    console.log(filteredProducts);

    return (
        <>
            <Header />

            <WebBanner
                bannerTitle="Our Store"
                bannerPara="Premium nail care products and professional tools"
            />

            <div className="container" style={{ padding: "70px 0" }}>
                {/* Tabs */}
                <ul className="nav nav-pills product-tabs mb-4">
                    {TABS.map((tab) => (
                        <li className="nav-item" key={tab.key}>
                            <button
                                className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* UI States */}
                {/* {loading && <ProductsSkeleton />}
                {error && <ErrorState message={error} />}

                {!loading && !error && filteredProducts.length === 0 && (
                    <EmptyState />
                )}

                {!loading && !error && filteredProducts.length > 0 && (
                    <ProductsGrid products={filteredProducts} />
                )} */}

                {loading && <ProductsSkeleton />}

                {!loading && error && <ErrorState message={error} />}

                {filteredProducts.length === 0 && <EmptyState />}

                {!loading && !error && filteredProducts.length > 0 && (
                    <ProductsGrid products={filteredProducts} />
                )}
            </div>

            <AppCTASection />
            <Footer />
        </>
    );
}
function ProductsGrid({ products }) {
    return (
        <div className="row g-4">
            {products.map((item) => {
                // const image =
                //     item.images && item.images?.length > 0
                //         ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[0]}`
                //         : "/images/prod_paint.png";

                return (
                    // <div key={item._id} className="col-xl-3 col-md-4">
                    //     <Link href={`/store/${item._id}`}>
                    //         <ProductCard
                    //             product={item}
                    //         />
                    //     </Link>
                    // </div>
                    <div key={item._id} className="col-xl-3 col-md-4">
                        <ProductCard
                            product={item}
                            actions={item._id}
                        />
                    </div>
                );
            })}
        </div>
    );
}

function ProductsSkeleton() {
    return (
        <div className="row g-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="col-xl-3 col-md-4">
                    <div className="card p-3">
                        <div className="skeleton-img mb-3" />
                        <div className="skeleton-text mb-2" />
                        <div className="skeleton-text small" />
                    </div>
                </div>
            ))}
        </div>
    );
}
function ErrorState({ message }) {
    return (
        <div className="alert alert-danger text-center">
            <strong>Error:</strong> {message}
        </div>
    );
}
function EmptyState() {
    return (
        <div className="text-center py-5">
            <h5>No products available</h5>
            <p className="text-muted">
                Please check another category or come back later.
            </p>
        </div>
    );
}
