// can't call anything using Document directly from SSR

"use client";
import dynamic from "next/dynamic";

const Main = dynamic(
  () => import("./main").then((mod) => ({ default: mod.Main })),
  { 
    ssr: false,
    loading: () => (
      <main>
        <div className="viewer-container">
          <div className="loading"></div>
        </div>
      </main>
    )
  }
);

interface PDFViewerWrapperProps {
  url: string;
}

export function MainWrapper({ url }: PDFViewerWrapperProps) {
  return <Main url={url} />;
}