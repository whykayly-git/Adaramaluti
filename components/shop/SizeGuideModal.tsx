"use client";

import { useState } from "react";
import { X } from "lucide-react";

const rows = [
  { size: "XS", bust: "78-81", waist: "60-63", hips: "86-89" },
  { size: "S", bust: "82-85", waist: "64-67", hips: "90-93" },
  { size: "M", bust: "86-90", waist: "68-72", hips: "94-98" },
  { size: "L", bust: "91-96", waist: "73-78", hips: "99-104" },
  { size: "XL", bust: "97-103", waist: "79-85", hips: "105-111" },
];

export function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-accent underline underline-offset-2"
      >
        Size Guide
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-lg text-primary">Size Guide (cm)</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close size guide">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="py-2 pr-4">Size</th>
                    <th className="py-2 pr-4">Bust</th>
                    <th className="py-2 pr-4">Waist</th>
                    <th className="py-2">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.size} className="border-b border-gray-50">
                      <td className="py-2 pr-4 font-semibold text-primary">{row.size}</td>
                      <td className="py-2 pr-4">{row.bust}</td>
                      <td className="py-2 pr-4">{row.waist}</td>
                      <td className="py-2">{row.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              For bespoke, made-to-measure pieces, visit our{" "}
              <a href="/bespoke" className="text-accent underline">
                Bespoke Orders
              </a>{" "}
              page instead.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
