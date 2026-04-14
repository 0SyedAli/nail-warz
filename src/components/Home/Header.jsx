// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useSelector } from "react-redux";

// export default function Header() {
//   const cartItems = useSelector((state) => state.cart.items);
//   const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);

//   return (
//     <header
//       className="header-home bg-white shadow-sm sticky-top"
//       style={{ zIndex: 1000 }}
//     >
//       <nav className="navbar navbar-expand-lg">
//         <div className="container position-relative">

//           {/* LEFT: LOGO + NAV */}
//           <div className="d-flex align-items-center gap-3">
//             <Link href="/" className="navbar-brand p-0 m-0">
//               <Image
//                 src="/images/logo.png"
//                 alt="NAIL WARZ"
//                 width={60}
//                 height={60}
//                 className="img-fluid"
//                 priority
//               />
//             </Link>

//             {/* NAV LINKS */}
//             <div
//               className="collapse navbar-collapse"
//               id="mainNavbar"
//             >
//               <ul className="navbar-nav ms-lg-4 ">
//                 <li className="">
//                   <Link href="/" className="nav-link text-dark  fw-medium">
//                     Home
//                   </Link>
//                 </li>
//                 <li className="">
//                   <Link href="/store" className="nav-link text-dark fw-medium">
//                     Store
//                   </Link>
//                 </li>
//                 <li className="">
//                   <Link href="/nailwarz" className="nav-link text-dark fw-medium">
//                     Nail Warz
//                   </Link>
//                 </li>
//                 <li className="">
//                   <Link href="/about" className="nav-link text-dark fw-medium">
//                     About us
//                   </Link>
//                 </li>
//                 <li className="">
//                   <Link href="/contact" className="nav-link text-dark fw-medium">
//                     Contact us
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* RIGHT: CART + CTA */}
//           <div className="d-flex align-items-center gap-3">

//             {totalQty > 0 && (
//               <Link
//                 href="/cart"
//                 className="btn btn-link btn-link-header text-dark px-0 py-2"
//                 aria-label="Shopping Cart"
//               >
//                 <Image
//                   src="/images/cart-head.png"
//                   alt="Cart"
//                   width={20}
//                   height={20}
//                   className="img-fluid"
//                   priority
//                 />
//                 {totalQty}
//               </Link>
//             )}

//             <Link href="/user-auth/signup" className="btn btn-header">
//               Join as a Professional
//             </Link>

//             {/* MOBILE TOGGLER */}
//             <button
//               className="navbar-toggler border-0"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#mainNavbar"
//               aria-controls="mainNavbar"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon" />
//             </button>
//           </div>

//         </div>
//       </nav>
//     </header>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { showSuccessToast } from "@/lib/toast";
import { clearCart } from "@/redux/slice/cartSlice";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const { isLoginModalOpen } = useSelector((state) => state.ui);

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // hide cart on these routes
  const hideCart = pathname === "/cart" || pathname === "/checkout";
  // Guest-only flow: token logic removed
  useEffect(() => {
    // Logic for auth checking removed as per request for guest-only flow
  }, []);

  return (
    <>
      <header
        className="header-home bg-white shadow-sm sticky-top"
        style={{ zIndex: 1000 }}
      >
        <nav className="navbar navbar-expand-lg">
          <div className="container position-relative">
            {/* LEFT: LOGO + NAV */}
            <div className="d-flex align-items-center gap-3">
              <Link href="/" className="navbar-brand p-0 m-0">
                <Image
                  src="/images/logo.png"
                  alt="NAIL WARZ"
                  width={60}
                  height={60}
                  className="img-fluid"
                  priority
                />
              </Link>

              {/* NAV LINKS */}
              <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav ms-lg-4 ">
                  <li>
                    <Link href="/" className="nav-link text-dark fw-medium">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/store" className="nav-link text-dark fw-medium">
                      Store
                    </Link>
                  </li>
                  <li>
                    <Link href="/nailwarz" className="nav-link text-dark fw-medium">
                      Nail Warz
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="nav-link text-dark fw-medium">
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="nav-link text-dark fw-medium">
                      Contact us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* RIGHT: CART */}
            <div className="d-flex align-items-center gap-3">
              {/* Removed Auth Area for Guest-only flow */}
              <Link href="/contact" className="btn btn-header">
                Join as a Professional
              </Link>
              {/* MOBILE TOGGLER */}
              <button
                className="navbar-toggler border-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavbar"
                aria-controls="mainNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
            </div>
          </div>
        </nav>
        {/* Global Login Modal */}
      </header>
      {!hideCart && totalQty > 0 && (
        <Link
          href="/cart"
          className="btn btn-link btn-link-header px-0 py-2 text-decoration-none"
          aria-label="Shopping Cart"
        >
          <Image
            src="/images/cart-head.png"
            alt="Cart"
            width={20}
            height={20}
            className="img-fluid"
            priority
          />
          <span>
            {totalQty}
          </span>
        </Link>
      )}
    </>
  );
}