"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import WebBanner from "@/components/Home/WebBanner";
import AppCTASection from "@/components/Home/AppCTASection";

import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";

export default function ProductPage() {
    const { pId } = useParams();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pId) return;

        const controller = new AbortController();

        async function fetchProduct() {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/superAdmin/product/${pId}`,
                    { signal: controller.signal }
                );

                const json = res.data;

                if (!json?.success || !json.product) {
                    throw new Error("Product not found");
                }

                setProduct(json.product);
                setRelatedProducts(json.relatedProducts);
            } catch (err) {
                if (axios.isCancel(err)) return;

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load product"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
        return () => controller.abort();
    }, [pId]);

    return (
        <>
            <Header />

            <WebBanner
                bannerTitle="Product Details"
                bannerPara="Premium nail care products and professional tools"
            />

            <div className="product-page container py-5">
                {loading && <ProductSkeleton />}
                {error && <ErrorState message={error} />}

                {!loading && !error && product && (
                    <>
                        <div className="row">
                            <div className="col-lg-6">
                                <ImageGallery images={product.images} />
                            </div>

                            <div className="col-lg-6">
                                <ProductInfo product={product} />
                            </div>
                        </div>

                        <RelatedProducts
                            category={product.category}
                            relatedProducts={relatedProducts}
                        />
                    </>
                )}
            </div>

            <AppCTASection />
            <Footer />
        </>
    );
}

function ProductSkeleton() {
    return (
        <div className="row">
            <div className="col-6">
                <div className="skeleton-img" />
            </div>
            <div className="col-6">
                <div className="skeleton-text mb-2" />
                <div className="skeleton-text small" />
            </div>
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
