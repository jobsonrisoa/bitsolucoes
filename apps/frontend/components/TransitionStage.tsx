"use client";
import React, { useEffect, useRef } from "react";
import { useTransition } from "./TransitionProvider";
import gsap from "gsap";
import { Mark } from "./svg/Mark";

export function TransitionStage() {
  const { isTransitioning } = useTransition();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTransitioning && layerRef.current) {
      // Play Íris out
      gsap.fromTo(layerRef.current, 
        { clipPath: "circle(0% at 50% 50%)", display: 'grid' },
        { clipPath: "circle(150% at 50% 50%)", duration: 0.7, ease: "power2.inOut" }
      );
    } else if (!isTransitioning && layerRef.current) {
      // Play Íris in (reveal new page)
      gsap.fromTo(layerRef.current, 
        { clipPath: "circle(150% at 50% 50%)" },
        { clipPath: "circle(0% at 50% 50%)", duration: 0.7, ease: "power2.inOut", onComplete: () => {
          if (layerRef.current) layerRef.current.style.display = 'none';
        }}
      );
    }
  }, [isTransitioning]);

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      <div
        ref={layerRef}
        className="absolute inset-0 grid place-items-center bg-red text-white"
        style={{ display: 'none' }}
      >
        <Mark className="h-36 w-36 self-center justify-self-center" />
      </div>
    </div>
  );
}
