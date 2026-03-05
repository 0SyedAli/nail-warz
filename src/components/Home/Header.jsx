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
import { closeLoginModal } from "@/redux/slice/uiSlice";
import LoginModal from "../Modal/LoginModal";
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
  // Read cookies on mount (and after logout)
  useEffect(() => {
    const t = Cookies.get("token") || null;

    let u = null;
    const userStr = Cookies.get("user");
    if (userStr) {
      try {
        u = JSON.parse(userStr);
      } catch (e) {
        u = null;
      }
    }

    setToken(t);
    setUser(u);
  }, []);

  const isLoggedIn = useMemo(() => Boolean(token), [token]);

  const displayName = user?.name || user?.full_name || user?.username || "User";

  // Support both absolute avatar URLs and relative paths
  // const avatarSrc = useMemo(() => {
  //   const a = user?.avatar || user?.profile_image || user?.image || "";
  //   if (!a) return "/images/default-avatar.png"; // add this file or change path
  //   if (a.startsWith("http://") || a.startsWith("https://")) return a;
  //   return a.startsWith("/") ? a : `/${a}`;
  // }, [user]);

  const handleLogout = () => {
    // remove whatever cookies you set on login
    Cookies.remove("token");
    Cookies.remove("user");

    // if you also store refresh token etc, remove them too:
    Cookies.remove("refresh_token");

    setToken(null);
    setUser(null);
    dispatch(clearCart());

    showSuccessToast("Logout successfully")
    router.push("/");
    router.refresh();
  };

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

            {/* RIGHT: CART + AUTH */}
            <div className="d-flex align-items-center gap-3">
              {/* AUTH AREA */}
              {!isLoggedIn ? (
                <>
                  <Link href="/user-auth/login" className="btn btn-outline-dark">
                    Login
                  </Link>

                  <Link href="/user-auth/signup" className="btn btn-header">
                    Join as a Professional
                  </Link>
                </>
              ) : (
                <div className="dropdown header-dropdown2">
                  <button
                    className="btn btn-light d-flex align-items-center gap-2 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {/* <Image
                    src={avatarSrc}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="rounded-circle"
                    priority
                  /> */}
                    <div className="user-avatar2">
                      {displayName.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="fw-medium text-dark text-capitalize">{displayName}</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    {/* <li>
                    <Link className="dropdown-item" href="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/orders">
                      Orders
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li> */}
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}

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
      <LoginModal
        show={isLoginModalOpen}
        onClose={() => dispatch(closeLoginModal())}
      />
    </>
  );
}