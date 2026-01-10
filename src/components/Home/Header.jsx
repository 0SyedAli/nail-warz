"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Header() {
  const cartItems = useSelector(state => state.cart.items);
  const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);
  return (
    <header className="header-home bg-white shadow-sm sticky-top" style={{ zIndex: 1000 }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-3">

          <div className="d-flex align-items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="NAIL WARZ"
              width={60}
              height={60}
              className="img-fluid"
              priority
            />

            <nav className="d-none d-md-flex align-items-center gap-4">
              <Link href="/" className="text-dark text-decoration-none fw-medium">Home</Link>
              <Link href="/store" className="text-dark text-decoration-none fw-medium">Store</Link>
              <Link href="/nailwarz" className="text-dark text-decoration-none fw-medium">Nail Warz</Link>
              <Link href="/about" className="text-dark text-decoration-none fw-medium">About us</Link>
              <Link href="/contact" className="text-dark text-decoration-none fw-medium">Contact us</Link>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* <button className="btn btn-link btn-link-header px-0 py-2" aria-label="Search">
              <Image
                src="/images/search-head.png"
                alt="NAIL WARZ"
                width={20}
                height={20}
                className="img-fluid"
                priority
              />
            </button> */}
            {totalQty > 0 &&
              <Link href="/cart" className="btn btn-link btn-link-header text-dark px-0 py-2" aria-label="Shopping Cart">
                <Image
                  src="/images/cart-head.png"
                  alt="NAIL WARZ"
                  width={20}
                  height={20}
                  className="img-fluid"
                  priority
                />
                {totalQty}
              </Link>}
            <Link href="/contact" className="btn  btn-header">
              Join as professional
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
