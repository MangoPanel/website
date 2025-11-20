"use client";
import { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

if (typeof window !== "undefined")
  if (!pdfjs.GlobalWorkerOptions.workerSrc)
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface MainProps {
  url: string;
}

export function Main({ url }: MainProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const file = useMemo(() => ({ url }), [url]);
  const options = useMemo(
    () => ({
      disableRange: true,
      disableStream: true,
    }),
    []
  );

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 2, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 2, numPages - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setCurrentPage((prev) => Math.max(prev - 2, 1));
      else if (e.key === "ArrowRight")
        setCurrentPage((prev) => Math.min(prev + 2, numPages - 1));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages]);

  const getVisiblePages = () => {
    const pages = [];
    
    if (currentPage <= numPages) {
      pages.push(currentPage);
    }
    
    if (currentPage + 1 <= numPages) {
      pages.push(currentPage + 1);
    }
    
    return pages;
  };

  return (
    <main>
      <div className="viewer-container">
        <div className="pdf-viewer">
          <Document
            file={file}
            options={options}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="loading"></div>}
            error={<div className="error">Failed to load PDF</div>}
          >
            <div className="pages">
              {getVisiblePages().map((pageNumber) => (
                <div key={pageNumber} className="page-container">
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={<div className="page-loading">Loading page {pageNumber}...</div>}
                  />
                </div>
              ))}
            </div>
          </Document>
        </div>
        <div className="controls">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage <= 1}
            className="control-btn"
          >
            ← Previous
          </button>
          
          <span className="page-info">
            {currentPage}-{Math.min(currentPage + 1, numPages)} of {numPages}
          </span>
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= numPages - 1}
            className="control-btn"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}