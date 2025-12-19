"use client";

import { Zap } from "lucide-react";

export default function TopBanner() {
  return (
    <div className="bg-dark text-white text-center py-2 d-flex align-items-center justify-content-center gap-2">
      <Zap size={16} />
      <span className="fw-medium">First Visit Free! Try Smart Nail Box Today</span>
    </div>
  );
}

