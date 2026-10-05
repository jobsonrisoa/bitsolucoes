"use client";
import React from "react";
import Link from "next/link";
import { useTransition } from "./TransitionProvider";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  withTransition?: boolean;
}

export function TransitionLink({ href, children, withTransition = false, ...props }: Props) {
  const { navigate } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!withTransition) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
