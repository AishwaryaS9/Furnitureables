"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import Papa from "papaparse";
import { UploadCloud, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CSVPreview from "./CSVPreview";
import UploadSummary from "./UploadSummary";
import ValidationErrors from "./ValidationErrors";
import { parseProductsCSV } from "@/lib/csv/parser";
import { Input } from "@/components/ui/input";

export default function UploadCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setErrors([]);
    setSummary(undefined);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const products = parseProductsCSV(results.data as any[]);
        setRows(products);
      },
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv"))) {
      handleFile(droppedFile);
    }
  };

  const handleResetFile = () => {
    setFile(null);
    setRows([]);
    setErrors([]);
    setSummary(undefined);
  };

  const uploadProducts = async () => {
    if (rows.length === 0) return;

    setIsUploading(true);
    setErrors([]);
    setSummary(undefined);

    try {
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
    } catch {
      setErrors(["An unexpected network error occurred while uploading. Please try again."]);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6" aria-live="polite">
      {/* File Dropzone or Selected File Card */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="region"
          aria-label="CSV file upload dropzone"
          className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer 
            focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 ${isDragging
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border/80 hover:border-primary/50 bg-muted/20 hover:bg-muted/40"
            }`}
        >
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            aria-label="Upload product CSV file"
            aria-describedby="csv-upload-instructions"
            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer border-0 p-0 file:hidden"
          />

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-2xs" aria-hidden="true">
            <UploadCloud className="h-7 w-7" />
          </div>

          <p className="text-base font-semibold text-foreground">
            Drag & drop your CSV file here, or{" "}
            <span className="text-primary underline underline-offset-4">browse</span>
          </p>
          <p id="csv-upload-instructions" className="text-xs text-muted-foreground mt-1 font-medium">
            Supports standard .CSV files up to 10MB
          </p>
        </div>
      ) : (
        <Card role="region" aria-label="Selected CSV file details" className="rounded-2xl border-border/80 bg-card shadow-xs">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                <FileSpreadsheet className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground" id="selected-file-name">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground font-medium" id="selected-file-meta">
                  {formatFileSize(file.size)} • {rows.length} product(s) parsed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                onClick={uploadProducts}
                disabled={isUploading || rows.length === 0}
                aria-label={isUploading ? "Uploading products to catalog" : `Upload ${rows.length} products from ${file.name}`}
                className="rounded-xl font-semibold px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  "Upload Products"
                )}
              </Button>

              {/* Cancel X Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleResetFile}
                disabled={isUploading}
                aria-label={`Remove selected file ${file.name}`}
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CSV Preview */}
      {rows.length > 0 && <CSVPreview rows={rows} />}

      {/* Upload Results Summary */}
      {summary && <UploadSummary summary={summary} />}

      {/* Validation Errors */}
      {errors.length > 0 && <ValidationErrors errors={errors} />}
    </div>
  );
}