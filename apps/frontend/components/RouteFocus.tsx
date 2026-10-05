"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteFocus() {
  const pathname = usePathname();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const heading = document.querySelector<HTMLElement>("main h1");
      if (!heading) return;

      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return null;
}
