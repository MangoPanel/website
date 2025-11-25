"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

if (typeof window !== "undefined")
  if (!pdfjs.GlobalWorkerOptions.workerSrc)
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface MainProps {
  url : string;
}

export function Main({ url }: MainProps) {
  const mobileWidth = 900;
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < mobileWidth);
  useEffect(() => {
    const handleResize = () => { setIsMobile(window.innerWidth < mobileWidth); }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const file = useMemo(() => ({ url }), [url]);
  const options = useMemo(
    () => ({
      disableRange: false,
      disableStream: false,
    }),
    []
  );

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) { setNumPages(numPages); }
  const pages = isMobile ? 1 : 2;

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - pages, 1));
  }, [pages]);
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + pages, numPages - (pages === 2 ? 1 : 0)));
  }, [pages, numPages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPreviousPage();
      else if (e.key === "ArrowRight") goToNextPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPreviousPage]);

  const getVisiblePages = () => {
    const pageArr = [];
    pageArr.push(currentPage);
    if (!isMobile && currentPage + 1 <= numPages)
      pageArr.push(currentPage + 1);
    return pageArr;
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
                    scale={1.2}
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={<div className="loading"></div>}
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
            disabled={currentPage >= numPages - (pages === 2 ? 1 : 0)}
            className="control-btn"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}
