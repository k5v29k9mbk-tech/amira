"use client";

import { Printer } from "@phosphor-icons/react";
import { btnPrimary } from "@/lib/ui";

// ponytail: the browser's print dialog is the PDF generator. No pdf library.
export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={btnPrimary}>
      <Printer size={17} weight="light" />
      {label}
    </button>
  );
}
