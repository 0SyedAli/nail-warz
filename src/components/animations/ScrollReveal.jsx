"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  direction = "left", // left | right | up | down
  delay = 0,
  duration = 1,
  distance = 80,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      let x = 0;
      let y = 0;

      if (direction === "left") x = -distance;
      if (direction === "right") x = distance;
      if (direction === "up") y = distance;
      if (direction === "down") y = -distance;

      gsap.fromTo(
        ref.current,
        { opacity: 0, x, y },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);
    // ✅ CLEANUP (THIS FIXES YOUR ERROR)
    return () => ctx.revert();
  }, [direction, delay, duration, distance]);

  return <div ref={ref}>{children}</div>;
}
