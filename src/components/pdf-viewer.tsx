"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useTheme } from "next-themes";

// Set the worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PDFViewerProps {
  file: string;
  className?: string;
}

export default function PDFViewer({ file, className = "" }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const { theme } = useTheme();
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  const loadPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(file);
      const pdf = await loadingTask.promise;
      pdfRef.current = pdf;
      setNumPages(pdf.numPages);
      
      // Render the first page
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext("2d");
      if (!context) return;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Set background based on theme
      context.fillStyle = theme === "dark" ? "#111827" : "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };
      
      await page.render(renderContext).promise;
      setLoading(false);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Error loading PDF:", err);
      
      // Retry up to 3 times
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(loadPDF, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        setError("Failed to load PDF after multiple attempts. Please try again later.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPDF();

    return () => {
      if (pdfRef.current) {
        pdfRef.current.destroy();
      }
    };
  }, [file, theme]); // loadPDF is intentionally omitted as it's defined inside the component

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className="text-center p-8">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className={`w-full h-auto ${loading || error ? "hidden" : ""}`}
      />
      
      {!loading && !error && (
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Page 1 of {numPages}
        </div>
      )}
    </div>
  );
}