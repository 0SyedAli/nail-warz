"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";

export default function Header() {
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
              <Link href="/" className="text-dark text-decoration-none fw-medium">Store</Link>
              <Link href="/" className="text-dark text-decoration-none fw-medium">Nail Warz</Link>
              <Link href="/" className="text-dark text-decoration-none fw-medium">About us</Link>
              <Link href="/" className="text-dark text-decoration-none fw-medium">Contact us</Link>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-link text-dark p-2" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="btn btn-link text-dark p-2" aria-label="Shopping Cart">
              <ShoppingCart size={20} />
            </button>
            <button className="btn  btn-header">
              Join as professional
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
