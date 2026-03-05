// import Image from "next/image";

// export default function CheckoutSummary() {
//     return (
//         <div className="checkout-summary">
//             <div className="summary-item-container">
//                 {[1, 2].map((i) => (
//                     <div key={i} className="summary-item">
//                         <Image
//                             src="/images/cart-img.png"
//                             width={122}
//                             height={122}
//                             alt="Product"
//                             className="summary-img"
//                         />

//                         <div className="flex-grow-1 ms-3">
//                             <h6 className="fw-bold mb-1 ">Lorem ipsum dollor</h6>
//                             <small className="text-muted d-block">Size: Large</small>
//                             <small className="text-muted d-block">Color: White</small>
//                         </div>

//                         <strong className="ci-price">$145</strong>
//                     </div>
//                 ))}
//             </div>

//             <div className="subtotal">
//                 <div className="d-flex justify-content-between mb-3">
//                     <span>Subtotal</span>
//                     <span>$1,095.00</span>
//                 </div>

//                 <div className="d-flex justify-content-between">
//                     <span>Shipping</span>
//                     <span className="text-muted">Calculated At Next Step</span>
//                 </div>
//             </div>
//             <div className="d-flex justify-content-between fw-bold fs-5 mt-3">
//                 <span>Total</span>
//                 <span>$1,095.00 USD</span>
//             </div>

//         </div>
//     );
// }


"use client";

import Image from "next/image";
import { useSelector } from "react-redux";

export default function CheckoutSummary({ discountData }) {
    // const cart = useSelector((state) => state.cart.items);

    // const subtotal = cart.reduce(
    //     (sum, item) => sum + item.price * item.qty,
    //     0
    // );

    const cart = useSelector((state) => state.cart.items);

    // Static shipping fee (you can modify this based on your logic)
    // const shipping = 15; 

    const shipping = useSelector((state) => state.cart.shippingFee);
    const deliveryDate = useSelector((state) => state.cart.deliveryDate);


    // Calculate subtotal
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const total = discountData ? discountData.finalTotal : subtotal + shipping;

    return (
        <div className="checkout-summary">
            <div className="summary-item-container">
                {cart
                    .filter((item) => item.qty > 0)
                    .map((item) => {
                        const image =
                            item.images?.length > 0
                                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.images[0]}`
                                : "/images/prod_paint.png";
                        return (
                            <div key={item._id} className="summary-item">
                                <Image src={image} width={80} height={80} alt={item.name} />

                                <div className="flex-grow-1 ms-3">
                                    <h6 className="fw-bold mb-1">{item.name}</h6>
                                    <small className="text-muted">
                                        Qty: {item.qty}
                                    </small>
                                </div>

                                <strong>${(item.price * item.qty).toFixed(2)}</strong>
                            </div>
                        );
                    })}
            </div>

            <div className="subtotal mt-3">
                <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>

                {/* Discount details */}
                {discountData && (
                    <>
                        <div className="d-flex justify-content-between mb-2 text-success">
                            <span>Discount ({discountData.discountType === 'percentage' ? `${discountData.discountValue}%` : `$${discountData.discountValue}`})</span>
                            <span>-${discountData.discountAmount.toFixed(2)}</span>
                        </div>
                        {discountData.eligibleAmount < subtotal && (
                            <div className="d-flex justify-content-between mb-2 small text-muted">
                                <span>Eligible Amount</span>
                                <span>${discountData.eligibleAmount.toFixed(2)}</span>
                            </div>
                        )}
                    </>
                )}

                {/* Total */}
                <div className="d-flex justify-content-between fw-bold fs-5 mt-3">
                    <span>Total</span>
                    <span>${total.toFixed(2)} USD</span>
                </div>

                {deliveryDate && (
                    <div className="mt-3 p-2 bg-light rounded text-center">
                        <span className="small text-muted">Estimated Delivery:</span><br />
                        <span className="fw-bold text-dark">{deliveryDate}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
