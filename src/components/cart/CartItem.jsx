"use client";

import Image from "next/image";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQty } from "@/redux/slice/cartSlice";

export default function CartItem({ item }) {
    console.log("item", item);
    
    const dispatch = useDispatch();

    return (
        <div className={`cart-item d-flex `}>

            {/* Image */}
            <Image
                src={item?.images ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item?.images[0]}` : "/images/prod_paint.png" }
                width={124}
                height={124}
                alt="Product"
                className="cart-img"
            />

            {/* Info */}
            <div className="flex-grow-1 ms-3">
                <h6 className="fw-bold mb-1">{item.name}</h6>
                {/* <small className="text-muted d-block">Size: {item?.size}</small> */}
                {/* <small className="text-muted d-block">Color: {item?.color}</small> */}
                <small className="text-muted d-block">SKU: {item?.sku}</small>

                <div className="fw-bold ci-price mt-1">${item.price}</div>
            </div>
            <div className="d-flex  flex-column justify-content-between align-items-end">
                {/* Remove */}
                <button className="btn-delete" onClick={() => dispatch(removeFromCart(item._id))}>
                    <RiDeleteBin6Fill />
                </button>

                {/* Qty */}
                <div className="qty-box">
                    <button  onClick={() => dispatch(updateQty({ id: item._id, qty: item.qty - 1 }))}>−</button>
                    <span>{item?.qty}</span>
                    <button onClick={() => dispatch(updateQty({ id: item._id, qty: item.qty + 1 }))}>+</button>
                </div>
            </div>
        </div>
    );
}
