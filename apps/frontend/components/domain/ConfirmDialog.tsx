"use client";
import React from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({ open, onOpenChange, onConfirm, title, description }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mb-6">{description}</p>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
        <Button className="bg-red border-red text-paper" onClick={() => { onConfirm(); onOpenChange(false); }}>Confirmar</Button>
      </div>
    </Dialog>
  );
}
