"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface PDFViewerProps {
  file: string;
  className?: string;
}

export default function PDFViewer({ file, className = "" }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const { theme } = useTheme();
  const pdfRef = useRef<any>(null);
  const renderTasksRef = useRef<any[]>([]);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  // Dynamically import pdfjs-dist on client side only
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        // Set the worker path for PDF.js
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
        setPdfjsLib(pdfjs);
      } catch (err) {
        console.error("Failed to load pdfjs-dist:", err);
        setError("Failed to load PDF viewer. Please try again later.");
        setLoading(false);
      }
    };
    
    loadPdfJs();
  }, []);

  const renderPage = async (pdf: any, pageNum: number) => {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      
      // Create canvas for this page
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.className = "w-full h-auto mb-4";
      
      // Set background based on theme
      context.fillStyle = theme === "dark" ? "#111827" : "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };
      
      // Create new render task
      const renderTask = page.render(renderContext);
      renderTasksRef.current.push(renderTask);
      
      await renderTask.promise;
      
      // Add canvas to container
      if (containerRef.current) {
        containerRef.current.appendChild(canvas);
      }
    } catch (err: any) {
      // Ignore cancellation errors
      if (err?.name !== "RenderingCancelledException") {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    }
  };

  const loadPDF = async () => {
    if (!pdfjsLib) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Cancel any ongoing render tasks
      renderTasksRef.current.forEach(task => {
        if (task && task.cancel) {
          task.cancel();
        }
      });
      renderTasksRef.current = [];
      
      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      
      // Destroy previous PDF document if exists
      if (pdfRef.current) {
        await pdfRef.current.destroy();
        pdfRef.current = null;
      }
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(file);
      const pdf = await loadingTask.promise;
      pdfRef.current = pdf;
      setNumPages(pdf.numPages);
      
      // Render all pages
      const renderPromises = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        renderPromises.push(renderPage(pdf, i));
      }
      
      await Promise.all(renderPromises);
      
      setLoading(false);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
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
    if (pdfjsLib) {
      loadPDF();
    }

    return () => {
      // Cleanup on unmount
      renderTasksRef.current.forEach(task => {
        if (task && task.cancel) {
          task.cancel();
        }
      });
      renderTasksRef.current = [];
      
      if (pdfRef.current) {
        pdfRef.current.destroy();
        pdfRef.current = null;
      }
    };
  }, [file, theme, pdfjsLib]);

  // Show loading state while pdfjs-lib is loading
  if (!pdfjsLib) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
      
      <div 
        ref={containerRef} 
        className={`w-full ${loading || error ? "hidden" : ""}`}
      />
      
      {!loading && !error && numPages > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {numPages} pages
        </div>
      )}
    </div>
  );
}