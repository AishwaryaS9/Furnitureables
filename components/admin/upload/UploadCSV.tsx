"use client";

import { useState } from "react";
import Papa from 'papaparse';
import CSVPreview from "./CSVPreview";
import UploadSummary from "./UploadSummary";
import ValidationErrors from "./ValidationErrors";
import { parseProductsCSV } from "@/lib/csv/parser";

export default function UploadCSV() {
  const [rows, setRows] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>();

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete(results) {
        const products = parseProductsCSV(results.data as any[]);

        setRows(products);
      },
    });
  };

  const uploadProducts = async () => {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    });

    const result = await response.json();

    setSummary(result.summary);

    if (result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <div className="space-y-6">

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleFile(file);
          }
        }}
      />

      {rows.length > 0 && (
        <>
          <CSVPreview rows={rows} />

          <button
            onClick={uploadProducts}
            className="rounded bg-primary px-5 py-2 text-white"
          >
            Upload Products
          </button>
        </>
      )}

      {summary && (
        <UploadSummary summary={summary} />
      )}

      {errors.length > 0 && (
        <ValidationErrors errors={errors} />
      )}
    </div>
  );
}