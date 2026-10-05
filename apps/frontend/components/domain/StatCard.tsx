"use client";
import * as React from "react";
import gsap from "gsap";
import { Card } from "../ui/Card";

export interface StatCardProps {
  label: string;
  value: number;
  colorVar: string;
}

export function StatCard({ label, value, colorVar }: StatCardProps) {
  const numRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (numRef.current) {
      gsap.fromTo(numRef.current, 
        { innerHTML: 0 }, 
        { innerHTML: value, duration: 1.5, snap: { innerHTML: 1 }, ease: "power2.out" }
      );
    }
  }, [value]);

  return (
    <Card data-testid="stat-card" className="relative p-6">
      <div 
        className="absolute top-4 right-4 w-[28px] h-[28px] border-2 border-ink" 
        style={{ backgroundColor: `var(${colorVar})` }} 
      />
      <h3 className="text-sm font-bold uppercase mb-2 tracking-wider">{label}</h3>
      <div ref={numRef} className="text-5xl font-archivo tabular-nums">{value}</div>
    </Card>
  );
}
