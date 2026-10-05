"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextData {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextData>({ navigate: () => {}, isTransitioning: false });

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (href: string) => {
    setIsTransitioning(true);
    // Custom logic to animate before pushing goes here...
    // We will simulate it with a timeout for the TransitionStage to play
    setTimeout(() => {
      router.push(href);
      setTimeout(() => setIsTransitioning(false), 300); // clear after navigation
    }, 700);
  };

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);
