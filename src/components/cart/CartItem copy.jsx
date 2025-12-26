"use client";

import Image from "next/image";
import { useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function CartItem({ price, size, color, className2 }) {
    const [qty, setQty] = useState(1);

    return (
        <div className={`cart-item d-flex ${className2 || ""}`}>

            {/* Image */}
            <Image
                src="/images/cart-img.png"
                width={124}
                height={124}
                alt="Product"
                className="cart-img"
            />

            {/* Info */}
            <div className="flex-grow-1 ms-3">
                <h6 className="fw-bold mb-1">Lorem ipsum dollor</h6>
                <small className="text-muted d-block">Size: {size}</small>
                <small className="text-muted d-block">Color: {color}</small>
                <div className="fw-bold ci-price mt-1">${price}</div>
            </div>
            <div className="d-flex  flex-column justify-content-between align-items-end">
                {/* Remove */}
                <button className="btn-delete">
                    <RiDeleteBin6Fill />
                </button>

                {/* Qty */}
                <div className="qty-box">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
            </div>
        </div>
    );
}
