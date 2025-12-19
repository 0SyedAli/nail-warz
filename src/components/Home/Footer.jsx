"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-4" style={{ background: '#8B0000' }}>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <p className="text-dark mb-0 small">Copyright 2025 Nails Warz. All Rights Reserved</p>
          <div className="d-flex gap-4">
            <Link href="/privacy-policy" className="text-dark text-decoration-none small">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="text-dark text-decoration-none small">Terms And Conditions</Link>
          </div>
          <div className="d-flex gap-4 align-items-center">
            <Link href="mailto:Help@NailWarz.Com" className="text-dark text-decoration-none d-flex align-items-center gap-2 small">
              <Mail size={16} style={{ color: '#C11111' }} />
              <span>Help@NailWarz.Com</span>
            </Link>
            <Link href="tel:+123445667889" className="text-dark text-decoration-none d-flex align-items-center gap-2 small">
              <Phone size={16} style={{ color: '#C11111' }} />
              <span>+1234 456 678 89</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

