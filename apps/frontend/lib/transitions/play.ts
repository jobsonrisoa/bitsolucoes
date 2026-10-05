"use client";
import gsap from "gsap";
import { TransitionMeta } from "./meta";

export const playTransition = (meta: TransitionMeta, element: HTMLElement, onComplete: () => void) => {
  if (meta.type === 'none') {
    onComplete();
    return;
  }
  
  if (meta.type === 'iris') {
    gsap.fromTo(element, 
      { clipPath: 'circle(0% at 50% 50%)' }, 
      { clipPath: 'circle(150% at 50% 50%)', duration: meta.duration || 0.7, ease: "power2.inOut", onComplete }
    );
  } else {
    // Fallback or other transitions
    gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: meta.duration || 0.5, onComplete });
  }
};
