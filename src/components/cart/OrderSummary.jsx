// // "use client";
// // import { useSelector } from "react-redux";

// // export default function OrderSummary() {
// //   const items = useSelector(state => state.cart.items);

// //   const subtotal = items.reduce(
// //     (sum, i) => sum + i.price * i.qty, 0
// //   );

// //   const shipping = 15;
// //   const total = subtotal + shipping;

// //   return (
// //     <div className="order-summary">

// //       <h5 className="fw-bold mb-3">Order Summary</h5>

// //       <div className="d-flex justify-content-between mb-4">
// //         <span className="text-muted">Subtotal</span>
// //         <span className="fw-bold">${subtotal.toFixed(2)}</span>
// //       </div>

// //       {/* <div className="d-flex justify-content-between mb-4">
// //         <span className="text-muted">Discount (-20%)</span>
// //         <span className="text-danger fw-bold">-$12</span>
// //       </div> */}

// //       <div className="d-flex justify-content-between mb-3">
// //         <span className="text-muted">Delivery Fee</span>
// //         <span className="fw-bold">${shipping}</span>
// //       </div>

// //       <hr />

// //       <div className="d-flex justify-content-between mb-3">
// //         <span className="text-muted">Total</span>
// //         <span className="fw-bold">${total.toFixed(2)}</span>
// //       </div>

// //       {/* <div className="d-flex gap-2">
// //         <input
// //           type="text"
// //           className="form-control promo-input"
// //           placeholder="Add promo code"
// //         />
// //         <button className="btn btn-danger rounded-pill px-4">
// //           Apply
// //         </button>
// //       </div> */}

// //     </div>
// //   );
// // }


// "use client";
// import { useSelector } from "react-redux";
// import { useState } from "react";

// export default function OrderSummary() {
//   const items = useSelector(state => state.cart.items);

//   const subtotal = items.reduce(
//     (sum, i) => sum + i.price * i.qty, 0
//   );

//   const [shippingType, setShippingType] = useState("flat");

//   const shippingOptions = {
//     flat: 7,
//     expedited: 30
//   };

//   const isFree = subtotal >= 50;

//   const shipping = isFree ? 0 : shippingOptions[shippingType];

//   const total = subtotal + shipping;

//   return (
//     <div className="order-summary">

//       <h5 className="fw-bold mb-3">Order Summary</h5>

//       <div className="d-flex justify-content-between mb-3">
//         <span>Subtotal</span>
//         <span>${subtotal.toFixed(2)}</span>
//       </div>

//       {/* Shipping Selection */}
//       <div className="mb-3">
//         <p className="fw-semibold mb-2">Select Shipping</p>

//         <div className="shipping-option">
//           <input
//             type="radio"
//             checked={shippingType === "flat"}
//             onChange={() => setShippingType("flat")}
//           />
//           <div className="ms-2">
//             <span>Flat Rate Shipping ($7.00)</span><br />
//             <span className="small text-muted">
//               Ships within 5–10 business days
//             </span>
//           </div>
//         </div>

//         <div className="shipping-option mt-2">
//           <input
//             type="radio"
//             checked={shippingType === "expedited"}
//             onChange={() => setShippingType("expedited")}
//           />
//           <div className="ms-2">
//             <span>Expedited Shipping ($30.00)</span><br />
//             <span className="small text-muted">
//               Ships within 2–3 business days
//             </span>
//           </div>
//         </div>

//         {isFree && (
//           <div className="text-success fw-semibold mt-2">
//             Orders over $50.00 ship free
//           </div>
//         )}
//       </div>

//       <hr />

//       <div className="d-flex justify-content-between mb-2">
//         <span>Delivery Fee</span>
//         <span>{shipping === 0 ? "FREE" : `$${shipping}`}</span>
//       </div>

//       <div className="d-flex justify-content-between fw-bold">
//         <span>Total</span>
//         <span>${total.toFixed(2)}</span>
//       </div>

//     </div>
//   );
// }


"use client";
import { useDispatch, useSelector } from "react-redux";
import { setShipping } from "@/redux/slice/cartSlice";

export default function OrderSummary() {
  const dispatch = useDispatch();

  const items = useSelector(state => state.cart.items);
  const shippingType = useSelector(state => state.cart.shippingType);
  const shippingFee = useSelector(state => state.cart.shippingFee);

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const isFree = subtotal >= 50;

  const handleShippingChange = (type) => {
    if (isFree) {
      dispatch(setShipping({ type, fee: 0 }));
      return;
    }

    const fee = type === "flat" ? 7 : 30;
    dispatch(setShipping({ type, fee }));
  };

  const total = subtotal + shippingFee;

  return (
    <div className="order-summary">

      <h5 className="fw-bold mb-3">Order Summary</h5>

      <div className="d-flex justify-content-between mb-3">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {/* Shipping Selection */}
      <div className="mb-3">
        <p className="fw-semibold mb-2">Select Shipping</p>

        <div
          className="shipping-option"
          onClick={() => handleShippingChange("flat")}
        >
          <input
            type="radio"
            checked={shippingType === "flat"}
            readOnly
          />
          <div className="ms-2">
            <span>Flat Rate Shipping ($7.00)</span><br />
            <span className="small text-muted">
              Ships within 5–10 business days
            </span>
          </div>
        </div>

        <div
          className="shipping-option mt-2"
          onClick={() => handleShippingChange("expedited")}
        >
          <input
            type="radio"
            checked={shippingType === "expedited"}
            readOnly
          />
          <div className="ms-2">
            <span>Expedited Shipping ($30.00)</span><br />
            <span className="small text-muted">
              Ships within 2–3 business days
            </span>
          </div>
        </div>

        {isFree && (
          <div className="text-success fw-semibold mt-2">
            Orders over $50.00 ship free
          </div>
        )}
      </div>

      <hr />

      <div className="d-flex justify-content-between mb-2">
        <span>Delivery Fee</span>
        <span>{shippingFee === 0 ? "FREE" : `$${shippingFee}`}</span>
      </div>

      <div className="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

    </div>
  );
}
